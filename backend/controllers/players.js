
const app = require('../server.js');


const getAllPlayers = async (req, res) => {
    const db = app.get('db');
    // const data = await db.players.find().catch(err => console.log(err));
    const data = await db.query('SELECT * FROM players JOIN player_stats ON players.id = player_stats.player_id JOIN teams on player_stats.team_id = teams.id').catch(err => console.log(err));

    // JOIN player_stats ON players.id = player_stats.player_id

    res.send({ status: 200, data, message: 'Retrieved list of players' });
};


const getPlayerById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.players.findOne({ id }).catch(err => console.log(err));
    // console.log(data, 'blogs!')
    if (!data) {
        return res.send({ status: 404, data: [], message: 'Player cannot be found' });
    }
    return res.send({ status: 200, data, message: 'Retrieved Player' });
};

const getPlayerStats = async (req, res) => {
    const db = app.get('db');

    const { show, playersFrom, sortBy } = req.query;

    const query = `
        SELECT * FROM player_stats
        JOIN players ON players.id = player_stats.player_id
        ORDER BY points DESC
        LIMIT 10
    `;

    const data = await db.query(query);

    res.send({ status: 200, data, message: 'Retrieved Player Stats' });
};

const createPlayer = async (req, res) => {
    console.log('hitting!');
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;

    const player = await db.players.findOne({ email }).catch(err => console.log(err, 'error'));
    console.log(player, 'player!');


    if (player) {
        return res.send({ status: 400, error: true, message: 'Player already exists' });
    }

    const createdPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: req.user.id });
    const createdStats = await db.player_stats.insert({ player_id: createdPlayer.id, team_id: null, season_id: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
    console.log('saved players and stats');

    const data = { ...createdStats, ...createdPlayer };
    return res.send({ status: 200, data, message: 'Player created' });
};


const updatePlayer = async (req, res) => {
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;
    const { id } = req.params;
    const player = await db.players.findOne({ id }).catch(err => console.log(err));
    if (!player) {
        return res.send({ status: 404, error: true, message: 'Player not found' });
    }
    const data = await db.players.update({ id }, { first_name, last_name, email, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update player error'));


    return res.send({ status: 200, data, message: 'Player updated' });
};


const deletePlayer = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const player = await db.players.findOne({ id }).catch(err => console.log(err));

    if (!player) {
        return res.send({ status: 404, error: true, message: 'Player not found' });
    }

    const data = await db.players.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete player error'));

    return res.send({ status: 200, data, message: 'Player deleted' });
};


module.exports = {
    getAllPlayers,
    getPlayerById,
    getPlayerStats,
    createPlayer,
    updatePlayer,
    deletePlayer,
};
