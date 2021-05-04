const app = require('../server.js');

const getGames = async (req, res) => {
    const db = app.get('db');

    const { season, division, team, page, fromLoadMore } = req.query;

    // let division_id;
    // let team_id;
    let season_id;


    if (!season || season === 'undefined') {
        season_id = await db.seasons.findOne({ is_active: true });
    }
    //  else {
    //   season_id = await db.seasons.findOne({name: season});
    // }

    const limit = 15;
    const offset = (!page || page <= 1) ? 0 : (page - 1) * limit;
    // console.log(req.query, 'query!')
    // console.log({page, limit, offset}, '🌟🌟🌟🌟🌟🌟🌟')

    const games_count = await db.query('SELECT count(*) FROM game_season_division where season_id = $1', [season || season_id.id]);

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
        WHERE gsd.season_id = ${season || season_id.id}
    `;

    if (division) {
    // division_id = await db.divisions.findOne({name: division})
        query += 'AND (gsd.division_id = $1)';
    }

    if (team) {
    // team_id = await db.teams.findOne({name: team})
        query += ' AND (h.id = $2 OR a.id = $2)';
    }

    query += 'ORDER BY g.start_date ';

    if (!division && !team) {
        query += 'LIMIT $3 OFFSET $4';
    }

    // const games = await db.query(query,[division_id && division_id.id, team_id && team_id.id, limit, offset]);
    const games = await db.query(query, [division, team, limit, offset]);

    // const seasons = await db.seasons.find();
    const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_date IS null AND hidden_date IS null ORDER BY id;');

    const divisions = await db.query(`
        select distinct d.id, d.name
        FROM team_season_division tsd
        JOIN divisions d ON d.id = tsd.division_id
        where tsd.season_id = $1
        order by id;
    `, [season || season_id.id]);

    const queryForTeams = `
        select d.name AS division_name, t.name, t.id
        FROM team_season_division tsd
        JOIN divisions d ON d.id = tsd.division_id
        JOIN teams t ON t.id = tsd.team_id
        ${division ? 'WHERE tsd.season_id = $1 AND tsd.division_id = $2' : 'WHERE tsd.season_id = $1'}
        order by name;
    `;

    const teams = await db.query(queryForTeams, [season || season_id.id, division]);

    res.send({ status: 200, data: { games, games_count: games_count[0].count, seasons, divisions, teams, fromLoadMore }, message: 'Retrieved list of games' });
};


const getGameById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.query(`
    select games.*, h.name AS home_team_name, a.name AS away_team_name, l.name AS location_name  from games
    join teams h on h.id = games.home_team
    join teams a on a.id = games.away_team
    join locations l on l.id = games.location_id
    where games.id = $1;
  `, [id]);

    console.log(data, 'DATA GET GAMES BY ID');
    if (!data) {
        return res.send({ status: 404, data: [], message: 'game cannot be found' });
    }
    return res.send({ status: 200, data: data[0], message: 'Retrieved game' });
};

const createGame = async (req, res) => {
    console.log('creating game!!');
    const db = app.get('db');

    const { home_team, away_team, location_id, start_date, season_id } = req.body;

    // let outOfDivision = false;
    // if(home_team.division_id !== away_team.division_id) {
    //     outOfDivision = true;
    //     // if outofdivision is true, we need to add both divisions to the game_season_division's table
    // }

    // console.log(req.body, 'REQ DOT BODY')

    const game = await db.games.insert({ home_team: home_team.home_team, away_team: away_team.away_team, location_id, start_date, has_been_played: false }).catch(err => console.log(err, 'error in games insert'));
    await db.game_season_division.insert({ game_id: game.id, season_id, division_id: home_team.division_id }).catch(err => console.log(err, 'error in GSD insert'));

    // console.log(game, 'GAME!!!')

    return res.send({ status: 200, data: game, message: 'Game created', notification_type: 'snack' });
};


module.exports = {
    getGames,
    getGameById,
    createGame,
};
