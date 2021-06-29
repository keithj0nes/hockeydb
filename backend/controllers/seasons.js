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
        console.log(error);
        // return next(error)
        let errorDetails;
        switch (error.routine) {
        case 'errorMissingColumn':
            errorDetails = { message: 'Cannot find column', snack: false };
            break;
        default:
            errorDetails = { message: 'An error occured', notification_type: 'snack' };
            break;
        }
        return res.send({ status: 400, error: true, ...errorDetails });
    }
};


const getSeasonById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.query('select * from blog where id = $1', [id]);
    // console.log(data, 'blogs!')
    if (!data) {
        return res.send({ status: 404, data: [], message: 'Blog cannot be found' });
    }
    return res.send({ status: 200, data, message: `Retrieved season ${data.id}` });
};


const createSeason = async (req, res) => {
    const db = app.get('db');
    const { name, type } = req.body;

    const season = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
    if (!!season.length) {
        return res.send({ status: 400, data: [], message: 'Season already exists' });
    }

    const data = await db.seasons.insert({ name, type, is_active: false, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create blog error'));
    return res.send({ status: 200, data, message: 'Season created', notification_type: 'snack' });
};


const updateSeason = async (req, res) => {
    const db = app.get('db');
    const { type, name, is_active, is_hidden } = req.body;
    const { id } = req.params;

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));
    if (!season) {
        return res.send({ status: 404, error: true, message: 'Season not found', notification_type: 'snack' });
    }

    // Manage hidden request
    if (req.body.hasOwnProperty('is_hidden')) {
        // const season = await db.seasons.findOne({ id }).catch(err => console.log(err));
        if (season.is_active) {
            return res.send({ status: 409, data: [], message: 'Cannot hide the currently active season', notification_type: 'snack' });
        }
        const data = await db.seasons.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden season error'));
        return res.send({ status: 200, data: { ...data[0], is_hidden }, message: is_hidden ? 'Season hidden' : 'Season unhidden', notification_type: 'snack' });
    }

    if (name) {
        const nameExists = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
        if (nameExists.length > 0 && (nameExists[0].id !== season.id)) {
            return res.send({ status: 409, data: [], message: 'Season already exists' });
        }
    }


    if (is_active) {
        // search current is_active seasons -> set to false
        // set a flag to change global active season
        const findIsActive = await db.seasons.findOne({ is_active }).catch(err => console.log(err, 'err in is_active'));
        await db.seasons.update({ id: findIsActive.id }, { is_active: false }).catch(err => console.log(err, 'updatedIsActive error'));
    }

    const data = await db.seasons.update({ id }, { name, type, is_active, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update season error'));
    return res.send({ status: 200, data: { ...data[0], updateCurrentSeasonGlobally: is_active }, message: 'Season updated', notification_type: 'snack' });
};


const deleteSeason = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));
    if (!season) {
        return res.send({ status: 404, error: true, message: 'Season not found', notification_type: 'snack' });
    }

    if (season.is_active) {
        return res.send({ status: 409, error: true, message: 'Cannot delete the currently active season', notification_type: 'snack' });
    }

    const data = await db.seasons.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete season error'));
    return res.send({ status: 200, data, message: 'Season deleted', notification_type: 'snack' });
};


module.exports = {
    getSeasons,
    getSeasonById,
    createSeason,
    updateSeason,
    deleteSeason,
};
