import app from '../server.js';


const getTeamsPageFilters = async (req, res, next) => {
    try {
        const db = app.get('db');
        // get seasons
        // get all teams
        const { season } = req.query;
        let season_id;

        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        const allTeamsQuery = `
            SELECT t.id, t.name FROM team_season_division tsd
            JOIN teams t ON t.id = tsd.team_id
            WHERE tsd.season_id = $1;
        `;

        const all_teams = await db.query(allTeamsQuery, [season || season_id.id]);
        const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_at IS null AND hidden_at IS null ORDER BY id;');
        return res.send({ status: 200, data: { seasons, all_teams }, message: 'Retrieved list of teams page filters' });
    } catch (error) {
        console.log('GET TEAMS PAGE FILTERS ERROR: ', error);
        return next(error);
    }
};


const getStandingsPageFilters = async (req, res, next) => {
    try {
        const db = app.get('db');
        // get seasons
        // get all divisions
        const { season } = req.query;
        let season_id;

        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        const allDivisionsQuery = `
            SELECT * FROM divisions
            WHERE season_id = $1 AND deleted_at IS null AND hidden_at IS null
            ORDER BY name;
        `;

        const divisions = await db.query(allDivisionsQuery, [season || season_id.id]);
        const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_at IS null AND hidden_at IS null ORDER BY id;');
        return res.send({ status: 200, data: { seasons, divisions }, message: 'Retrieved list of teams page filters' });
    } catch (error) {
        console.log('GET STANDINGS PAGE FILTERS ERROR: ', error);
        return next(error);
    }
};

const getNewsTags = async (req, res, next) => {
    try {
        const db = app.get('db');
        const data = await db.tags.find();
        return res.send({ status: 200, data, message: 'Retrieved news gets' });
    } catch (error) {
        console.log('GET NEWS TAGS ERROR: ', error);
        return next(error);
    }
};


export default {
    getTeamsPageFilters,
    getStandingsPageFilters,
    getNewsTags,
};
