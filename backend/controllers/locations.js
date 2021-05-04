const app = require('../server.js');

const getLocations = async (req, res) => {
    const db = app.get('db');
    const data = await db.query('SELECT * FROM locations WHERE deleted_date IS NULL ORDER BY UPPER(name)');
    res.send({ status: 200, data, message: 'Retrieved list of locations' });
};


const createLocation = async (req, res) => {
    const db = app.get('db');
    const { name, address } = req.body;

    const location = await db.locations.where('lower(name) = $1 AND deleted_date IS null', [name.toLowerCase()]).catch(err => console.log(err));
    if (!!location.length) {
        return res.send({ status: 400, error: true, message: 'Location already exists' });
    }

    const data = await db.locations.insert({ name, address, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create location error'));
    return res.send({ status: 200, data, message: 'Location created', notification_type: 'snack' });
};

const updateLocation = async (req, res) => {
    const db = app.get('db');
    const { name, address } = req.body;
    const { id } = req.params;

    const location = await db.locations.findOne({ id }).catch(err => console.log(err));
    if (!location) {
        return res.send({ status: 404, error: true, message: 'Location not found', notification_type: 'snack' });
    }

    if (name) {
        const nameExists = await db.locations.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
        if (nameExists.length > 0 && (nameExists[0].id !== location.id)) {
            return res.send({ status: 409, data: [], message: 'Location already exists' });
        }
    }

    const data = await db.locations.update({ id }, { name, address, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update location error'));
    return res.send({ status: 200, data: data[0], message: 'Location updated', notification_type: 'snack' });
};

const deleteLocation = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const location = await db.locations.findOne({ id }).catch(err => console.log(err));
    if (!location) {
        return res.send({ status: 404, error: true, message: 'Location not found', notification_type: 'snack' });
    }

    const data = await db.locations.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete location error'));
    return res.send({ status: 200, data: data[0], message: 'Location deleted', notification_type: 'snack' });
};


module.exports = {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
};
