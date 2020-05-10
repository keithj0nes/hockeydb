const app = require('../server.js');

const getAllTeams = async (req, res) => {
  const db = app.get('db');

  console.log(req.session, 'req.user')
  console.log(req.query, 'getting teams!')
  let { division_id, division, season, orderby } = req.query;
  // console.log(division_id, 'divid')
  

  const season_id = await db.seasons.findOne({name: season, 'deleted_date =': null}).catch(err => console.log(err, 'ERROR!!!'))
  const divisions = await db.divisions.find({season_id: season_id.id,}).catch(err => console.log(err, 'error in getTeams divisions'));
  const seasons = await db.seasons.find({'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));

  let query = `
    SELECT teams.*, seasons.name AS season_name, seasons.id AS season_id, divisions.name AS division_name, divisions.id AS division_id FROM team_season_division tsd 
    JOIN teams ON teams.id = tsd.team_id
    JOIN seasons ON seasons.id = tsd.season_id
    JOIN divisions ON divisions.id = tsd.division_id
    WHERE tsd.season_id = ${season_id.id} AND ${!!division ? 'divisions.name = $1': 'tsd.division_id is not null'}
  `;

  if(orderby) {
    query += `ORDER BY division_name`
  } else {
    query += 'ORDER BY lower(teams.name)';
  }


  const data = await db.query(query, [division, orderby]);
  res.status(200).send({ status: 200, data: {teams: data, divisions, seasons}, message: 'Retrieved list of teams' });
}


const getTeamById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const { season, division } = req.query;
  let season_id;

  console.log(req.query, "REQ DOT QUERY")


  const team = await db.teams.findOne({ id }).catch(err => console.log(err));
  if (!team) {
    return res.status(404).send({ status: 404, data: [], message: 'Team cannot be found' })
  }

  // get schedule
  if(!season || season === 'undefined'){
    season_id = await db.seasons.findOne({is_active: true});
  }

  const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_date IS null AND hidden_date IS null ORDER BY id;');

  const recordQuery = `
    select games_played, wins, losses, points, goals_for, goals_against, penalties_in_minutes from team_season_division where season_id = ${season || season_id.id} AND team_id = $1;
  `;

  let record = await db.query(recordQuery, [id]);

  // console.log(record, 'RECORD!!!!!')
  if(record.length === 0) {
    record = [{ games_played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      goals_for: 0,
      goals_against: 0,
      penalties_in_minutes: 0 }];
  }

  const recentQuery = `
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
    WHERE gsd.season_id = ${season || season_id.id} AND (h.id = $1 OR a.id = $1) AND g.has_been_played = true
    ORDER BY g.start_date desc limit 5;
  `;

  const recent = await db.query(recentQuery, [id]);

// console.log(recent, 'RECENT')
  const scheduleQuery = `
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
    WHERE gsd.season_id = ${season || season_id.id} AND (h.id = $1 OR a.id = $1) 
    ORDER BY g.start_date;
  `;

  const schedule = await db.query(scheduleQuery, [id]);

  // console.log(schedule, 'SCHEUDLE!!');

  res.status(200).send({ status: 200, data: {team, schedule, recent, record: record[0], seasons}, message: 'Retrieved Team' })
}

module.exports = {
  getAllTeams,
  getTeamById
}


//need to upgrade to massive@next to 6.0 for joins to work
  // const teamsWithDivisions = await db.teams.join({
  //   divisions: {
  //     type: 'INNER',
  //     on: {division_id: 'id'}
  //   }
  // }).find({
  //   // state: 'EV',
  //   // 'books.author ILIKE': 'calvino, %'
  // });
  
  // console.log(teamsWithDivisions, 'aye')