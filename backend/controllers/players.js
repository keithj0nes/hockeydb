
const app = require('../server.js');


const getAllPlayers = async (req, res, next) => {
    try {
        const db = app.get('db');
        // const data = await db.players.find();
        const data = await db.query('SELECT * FROM players JOIN player_stats ON players.id = player_stats.player_id JOIN teams on player_stats.team_id = teams.id');

        // JOIN player_stats ON players.id = player_stats.player_id

        return res.send({ status: 200, data, message: 'Retrieved list of players' });
    } catch (error) {
        console.log('GET PLAYERS ERROR: ', error);
        return next(error);
    }
};


const getPlayerById = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const data = await db.players.findOne({ id });
        // console.log(data, 'blogs!')
        if (!data) {
            return res.send({ status: 404, data: [], message: 'Player cannot be found' });
        }
        return res.send({ status: 200, data, message: 'Retrieved Player' });
    } catch (error) {
        console.log('GET PLAYER BY ID ERROR: ', error);
        return next(error);
    }
};

const getPlayerStats = async (req, res, next) => {
    try {
        const db = app.get('db');

        const { show, playersFrom, sortBy } = req.query;

        const query = `
            SELECT * FROM player_stats
            JOIN players ON players.id = player_stats.player_id
            ORDER BY points DESC
            LIMIT 10
        `;

        const data = await db.query(query);

        return res.send({ status: 200, data, message: 'Retrieved Player Stats' });
    } catch (error) {
        console.log('GET PLAYER STATS ERROR: ', error);
        return next(error);
    }
};

const createPlayer = async (req, res, next) => {
    try {
        console.log('hitting!');
        const db = app.get('db');
        const { first_name, last_name, email } = req.body;

        const player = await db.players.findOne({ email });
        console.log(player, 'player!');


        if (player) {
            return res.send({ status: 400, error: true, message: 'Player already exists' });
        }

        const createdPlayer = await db.players.insert({ first_name, last_name, email, created_at: new Date(), created_by: req.user.id });
        const createdStats = await db.player_stats.insert({ player_id: createdPlayer.id, team_id: null, season_id: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
        console.log('saved players and stats');

        const data = { ...createdStats, ...createdPlayer };
        return res.send({ status: 200, data, message: 'Player created' });
    } catch (error) {
        console.log('CREATE PLAYER ERROR: ', error);
        return next(error);
    }
};


const updatePlayer = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { first_name, last_name, email } = req.body;
        const { id } = req.params;
        const player = await db.players.findOne({ id });
        if (!player) {
            return res.send({ status: 404, error: true, message: 'Player not found' });
        }
        const data = await db.players.update({ id }, { first_name, last_name, email, updated_at: new Date(), updated_by: req.user.id });
        return res.send({ status: 200, data, message: 'Player updated' });
    } catch (error) {
        console.log('UPDATE PLAYER ERROR: ', error);
        return next(error);
    }
};


const deletePlayer = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const player = await db.players.findOne({ id });
        if (!player) {
            return res.send({ status: 404, error: true, message: 'Player not found' });
        }
        const data = await db.players.update({ id }, { deleted_at: new Date(), deleted_by: req.user.id });
        return res.send({ status: 200, data, message: 'Player deleted' });
    } catch (error) {
        console.log('DELETE PLAYER ERROR: ', error);
        return next(error);
    }
};


module.exports = {
    getAllPlayers,
    getPlayerById,
    getPlayerStats,
    createPlayer,
    updatePlayer,
    deletePlayer,
};
