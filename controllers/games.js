const app = require('../server.js');

const getGames1 = async (req, res) => {
  const db = app.get('db');
  const data = await db.get_games();
  // console.log(data, 'GAMES!')
  res.status(200).send({ status: 200, data, message: 'Retrieved list of games' })
}

const getGames = async (req, res) => {
  const db = app.get('db');

  const { season, division, team } = req.query;

  let division_id;
  let team_id;
  let season_id;

  if(!season || season === 'undefined'){
    season_id = await db.seasons.findOne({is_active: true});
  } else {
    season_id = await db.seasons.findOne({name: season});
  }

  let query = `
    SELECT g.id, g.start_date, g.home_score, g.away_score, g.has_been_played,
    h.name AS home_team, h.id AS home_team_id,
    a.name AS away_team, a.id AS away_team_id,
    locations.name AS location_name, locations.id AS location_id,
    seasons.name AS season_name, divisions.name AS division_name 
    FROM game_season_division gsd 
    JOIN games g ON g.id = gsd.game_id
    JOIN teams h ON h.id = g.home_team
    JOIN teams a ON a.id = g.away_team
    JOIN seasons ON seasons.id = gsd.season_id
    JOIN divisions ON divisions.id = gsd.division_id
    JOIN locations ON locations.id = g.location_id
    WHERE gsd.season_id = ${season_id.id}
  `;

  if(division) {
    division_id = await db.divisions.findOne({name: division})
    query +=  'AND (gsd.division_id = $1)';
  }

  if(team) {
    team_id = await db.teams.findOne({name: team})
    query += ' AND (h.id = $2 OR a.id = $2)';
  }

  query += 'ORDER BY g.start_date';

  const games = await db.query(query,[division_id && division_id.id, team_id && team_id.id]);

  // const seasons = await db.seasons.find();
  const seasons = await db.query('select id, name from seasons;');

  const divisions = await db.query(`
    select distinct d.id, d.name
    FROM team_season_division tsd
    JOIN divisions d ON d.id = tsd.division_id
    where tsd.season_id = $1
    order by id;
  `,[season_id.id]);

  let queryForTeams = `
    select d.name AS division_name, t.name
    FROM team_season_division tsd
    JOIN divisions d ON d.id = tsd.division_id
    JOIN teams t ON t.id = tsd.team_id
    ${division_id ? 'WHERE tsd.season_id = $1 AND tsd.division_id = $2' : 'WHERE tsd.season_id = $1'}
    order by name;
  `;

  const teams = await db.query(queryForTeams,[season_id.id, division_id && division_id.id]);

  res.status(200).send({ status: 200, data: {games, seasons, divisions, teams}, message: 'Retrieved list of games' })
}



const getGameById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const data = await db.query('select * from games where id = $1', [id]);
  if (!data) {
    return res.status(404).send({ status: 404, data: [], message: 'game cannot be found' })
  }
  res.status(200).send({ status: 200, data, message: 'Retrieved game' })
}


module.exports = {
  getGames,

}