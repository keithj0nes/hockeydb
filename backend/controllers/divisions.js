const app = require('../server.js');
// const helpers = require('./helpers');

const getAllDivisions = async (req, res) => {
    const db = app.get('db');
    const { season } = req.query;

    const season_id = await db.seasons.findOne({ name: season, 'deleted_date =': null }).catch(err => console.log(err, 'ERRR'));
    // const query = helpers.filter(req.query, ['season'])

    // const data = await db.divisions.find({ ...query, season_id: season_id.id }, { order: [ {field: 'name', direction: 'asc'}]}).catch(err => console.log(err, 'error'));

    const q = `
      SELECT d.id, d.name, COUNT(tsd.id) as teams_count FROM team_season_division tsd
      LEFT JOIN divisions d ON d.id = tsd.division_id
      WHERE tsd.season_id = $1
      GROUP BY d.id;
    `;
    const data = await db.query(q, [season_id.id]);
    const seasons = await db.seasons.find({ 'hidden_date =': null, 'deleted_date =': null }).catch(err => console.log(err));

    res.send({ status: 200, data: { divisions: data, seasons }, message: 'Retrieved list of Divisions' });
};

// const getDivisionById = async (req, res) => {
//   const db = app.get('db');
//   const { season_id } = req.params;
//   console.log(season_id, 'id!')
//   const data = await db.divisions.find({ season_id }).catch(err => console.log(err));
//   console.log(data, 'data!')
//   if (!data) {
//     return res.send({ status: 404, data: [], message: 'Division cannot be found' })
//   }
//   res.send({ status: 200, data, message: 'Retrieved Division' })
// }


const createDivision = async (req, res) => {
    const db = app.get('db');
    const { name, season } = req.body;

    const season_id = await db.seasons.findOne({ name: season });
    if (!season_id) return res.send({ status: 404, error: true, message: 'Cannot find season' });

    const division = await db.divisions.where('lower(name) = $1 AND season_id = $2', [name.toLowerCase(), season_id.id]).catch(err => console.log(err, 'error in crete division'));
    if (!!division.length) {
        return res.send({ status: 400, error: true, message: 'Division under this season already exists' });
    }

    const data = await db.divisions.insert({ name, season_id: season_id.id, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create division error'));
    return res.send({ status: 200, data, message: 'Division created', notification_type: 'snack' });
};


const updateDivision = async (req, res) => {
    const db = app.get('db');
    const { name, is_hidden } = req.body;
    const { id } = req.params;

    const division = await db.divisions.findOne({ id }).catch(err => console.log(err));
    if (!division) {
        return res.send({ status: 404, error: true, message: 'Division not found', notification_type: 'snack' });
    }

    // Manage hidden request
    if (req.body.hasOwnProperty('is_hidden')) {
        const data = await db.divisions.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden division error'));
        return res.send({ status: 200, data: data[0], message: is_hidden ? 'Division hidden' : 'Division unhidden', notification_type: 'snack' });
    }

    if (!!name) {
        // need to allow name exists so long as it's from a different season - can have the same division names between seasons
        const nameExists = await db.divisions.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
        if (nameExists.length > 0 && (nameExists[0].id !== division.id)) {
            return res.send({ status: 409, data: [], message: 'Division already exists' });
        }
    }

    const data = await db.divisions.update({ id }, { name, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update Division error'));
    return res.send({ status: 200, data: data[0], message: 'Division updated', notification_type: 'snack' });
};

const deleteDivision = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const division = await db.divisions.findOne({ id }).catch(err => console.log(err));
    if (!division) {
        return res.send({ status: 404, error: true, message: 'Division not found', notification_type: 'snack' });
    }

    const divisionHasTeams = await db.team_season_division.findOne({ division_id: division.id });
    if (divisionHasTeams) {
        return res.send({ status: 409, error: true, message: 'Division cannot be deleted, there are teams in this division' });
    }

    const data = await db.divisions.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete Division error'));
    return res.send({ status: 200, data: data[0], message: 'Division deleted', notification_type: 'snack' });
};

module.exports = {
    getAllDivisions,
    // getDivisionById
    createDivision,
    updateDivision,
    deleteDivision,
};
