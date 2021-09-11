const app = require('../server.js');

const getLocations = async (req, res, next) => {
    try {
        const db = app.get('db');
        const data = await db.query('SELECT * FROM locations WHERE deleted_at IS NULL ORDER BY UPPER(name)');
        return res.send({ status: 200, data, message: 'Retrieved list of locations' });
    } catch (error) {
        console.log('GET LOCATIONS ERROR: ', error);
        return next(error);
    }
};


const createLocation = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, address } = req.body;

        const location = await db.locations.where('lower(name) = $1 AND deleted_at IS null', [name.toLowerCase()]);
        if (!!location.length) {
            return res.send({ status: 400, error: true, message: 'Location already exists' });
        }

        const data = await db.locations.insert({ name, address, created_at: new Date(), created_by: req.user.id });
        return res.send({ status: 200, data, message: 'Location created', notification_type: 'snack' });
    } catch (error) {
        console.log('CREATE LOCATION ERROR: ', error);
        return next(error);
    }
};

const updateLocation = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, address } = req.body;
        const { id } = req.params;

        const location = await db.locations.findOne({ id });
        if (!location) {
            return res.send({ status: 404, error: true, message: 'Location not found', notification_type: 'snack' });
        }

        if (name) {
            const nameExists = await db.locations.where('lower(name) = $1', [name.toLowerCase()]);
            if (nameExists.length > 0 && (nameExists[0].id !== location.id)) {
                return res.send({ status: 409, data: [], message: 'Location already exists' });
            }
        }

        const data = await db.locations.update({ id }, { name, address, updated_at: new Date(), updated_by: req.user.id });
        return res.send({ status: 200, data: data[0], message: 'Location updated', notification_type: 'snack' });
    } catch (error) {
        console.log('UPDATE LOCATION ERROR: ', error);
        return next(error);
    }
};

const deleteLocation = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;

        const location = await db.locations.findOne({ id });
        if (!location) {
            return res.send({ status: 404, error: true, message: 'Location not found', notification_type: 'snack' });
        }

        const data = await db.locations.update({ id }, { deleted_at: new Date(), deleted_by: req.user.id });
        return res.send({ status: 200, data: data[0], message: 'Location deleted', notification_type: 'snack' });
    } catch (error) {
        console.log('DELETE LOCATION ERROR: ', error);
        return next(error);
    }
};


module.exports = {
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
};
