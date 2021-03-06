const app = require('../server.js');
const helpers = require('./helpers');


const getSeasons = async (req, res, next) => {
    try {
        const db = app.get('db');
        const query = helpers.filter(req.query);
        console.log(req.query, ' req.query!');

        const { limit = 2, page = 1, dir = 'desc' } = req.query;

        const offset = (!page || page <= 1) ? 0 : (page - 1) * limit;
        console.log(offset);
        const total_count = await db.seasons.count({ ...query });
        const seasons = await db.seasons.find({
            ...query,
        }, {
            order: [{ field: 'id', direction: dir }],
            offset,
            limit,
        });

        const total_pages = Math.ceil(total_count / limit);
        console.log({ total_count: parseInt(total_count), seasons_length: seasons.length, total_pages, page: parseInt(page) });

        return res.send({ status: 200, data: { seasons, pagination: { total_count: parseInt(total_count), total_pages, page: parseInt(page) } }, message: 'Retrieved list of seasons' });
    } catch (error) {
        console.log('GET SEASONS ERROR: ', error);
        return next(error);
    }
};


const getSeasonById = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const data = await db.query('select * from blog where id = $1', [id]);
        if (!data) {
            return res.send({ status: 404, data: [], message: 'Blog cannot be found' });
        }
        return res.send({ status: 200, data, message: `Retrieved season ${data.id}` });
    } catch (error) {
        console.log('GET SEASON BY ID ERROR: ', error);
        return next(error);
    }
};


const createSeason = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, type } = req.body;

        const season = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]);
        if (!!season.length) {
            return res.send({ status: 400, data: [], message: 'Season already exists' });
        }

        const data = await db.seasons.insert({ name, type, is_active: false, created_date: new Date(), created_by: req.user.id });
        return res.send({ status: 200, data, message: 'Season created', notification_type: 'snack' });
    } catch (error) {
        console.log('CREATE SEASON ERROR: ', error);
        return next(error);
    }
};


const updateSeason = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { type, name, is_active, is_hidden } = req.body;
        const { id } = req.params;

        const season = await db.seasons.findOne({ id });
        if (!season) {
            return res.send({ status: 404, error: true, message: 'Season not found', notification_type: 'snack' });
        }

        // Manage hidden request
        if (req.body.hasOwnProperty('is_hidden')) {
            if (season.is_active) {
                return res.send({ status: 409, data: [], message: 'Cannot hide the currently active season', notification_type: 'snack' });
            }
            const data = await db.seasons.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null });
            return res.send({ status: 200, data: { ...data[0], is_hidden }, message: is_hidden ? 'Season hidden' : 'Season unhidden', notification_type: 'snack' });
        }

        if (name) {
            const nameExists = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]);
            if (nameExists.length > 0 && (nameExists[0].id !== season.id)) {
                return res.send({ status: 409, data: [], message: 'Season already exists' });
            }
        }

        if (is_active) {
            // search current is_active seasons -> set to false
            // set a flag to change global active season
            const findIsActive = await db.seasons.findOne({ is_active });
            await db.seasons.update({ id: findIsActive.id }, { is_active: false });
        }

        const data = await db.seasons.update({ id }, { name, type, is_active, updated_date: new Date(), updated_by: req.user.id });
        return res.send({ status: 200, data: { ...data[0], updateCurrentSeasonGlobally: is_active }, message: 'Season updated', notification_type: 'snack' });
    } catch (error) {
        console.log('UPDATE SEASON ERROR: ', error);
        return next(error);
    }
};


const deleteSeason = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;

        const season = await db.seasons.findOne({ id });
        if (!season) {
            return res.send({ status: 404, error: true, message: 'Season not found', notification_type: 'snack' });
        }

        if (season.is_active) {
            return res.send({ status: 409, error: true, message: 'Cannot delete the currently active season', notification_type: 'snack' });
        }

        const data = await db.seasons.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id });
        return res.send({ status: 200, data, message: 'Season deleted', notification_type: 'snack' });
    } catch (error) {
        console.log('DELETE SEASON ERROR: ', error);
        return next(error);
    }
};


module.exports = {
    getSeasons,
    getSeasonById,
    createSeason,
    updateSeason,
    deleteSeason,
};
