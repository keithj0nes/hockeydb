const app = require('../server.js');

const getAllDivisions = async (req, res, next) => {
    console.log('GET ALL DIVISONS HIT');
    try {
        const db = app.get('db');
        const { season } = req.query;
        console.log('REQ.QUERY', req.query);
        console.log('SEASON BACKEND', season);

        const season_id = await db.seasons.findOne({
            name: season,
            'deleted_at =': null,
        });

        const q = `
            SELECT d.id, d.name, COUNT(tsd.id) as teams_count FROM team_season_division tsd
            LEFT JOIN divisions d ON d.id = tsd.division_id
            WHERE tsd.season_id = $1
            GROUP BY d.id;
        `;
        const data = await db.query(q, [season_id.id]);
        const seasons = await db.seasons.find({
            'hidden_at =': null,
            'deleted_at =': null,
        });

        return res.send({
            status: 200,
            data: { divisions: data, seasons },
            message: 'Retrieved list of Divisions',
        });
    } catch (error) {
        console.log('GET DIVISIONS ERROR: ', error);
        return next(error);
    }
};

const createDivision = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, season } = req.body;

        const season_id = await db.seasons.findOne({ name: season });
        if (!season_id)
            return res.send({
                status: 404,
                error: true,
                message: 'Cannot find season',
            });

        const division = await db.divisions.where(
            'lower(name) = $1 AND season_id = $2',
            [name.toLowerCase(), season_id.id]
        );
        if (!!division.length) {
            return res.send({
                status: 400,
                error: true,
                message: 'Division under this season already exists',
            });
        }

        const data = await db.divisions.insert({
            name,
            season_id: season_id.id,
            created_at: new Date(),
            created_by: req.user.id,
        });
        return res.send({
            status: 200,
            data,
            message: 'Division created',
            notification_type: 'snack',
        });
    } catch (error) {
        console.log('CREATE DIVISION ERROR: ', error);
        return next(error);
    }
};

const updateDivision = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, is_hidden } = req.body;
        const { id } = req.params;

        const division = await db.divisions.findOne({ id });
        if (!division) {
            return res.send({
                status: 404,
                error: true,
                message: 'Division not found',
                notification_type: 'snack',
            });
        }

        // Manage hidden request
        if (req.body.hasOwnProperty('is_hidden')) {
            const data = await db.divisions.update(
                { id },
                is_hidden
                    ? { hidden_at: new Date(), hidden_by: req.user.id }
                    : { hidden_at: null, hidden_by: null }
            );
            return res.send({
                status: 200,
                data: data[0],
                message: is_hidden ? 'Division hidden' : 'Division unhidden',
                notification_type: 'snack',
            });
        }

        if (!!name) {
            // need to allow name exists so long as it's from a different season - can have the same division names between seasons
            const nameExists = await db.divisions.where('lower(name) = $1', [
                name.toLowerCase(),
            ]);
            if (nameExists.length > 0 && nameExists[0].id !== division.id) {
                return res.send({
                    status: 409,
                    data: [],
                    message: 'Division already exists',
                });
            }
        }

        const data = await db.divisions.update(
            { id },
            { name, updated_at: new Date(), updated_by: req.user.id }
        );
        return res.send({
            status: 200,
            data: data[0],
            message: 'Division updated',
            notification_type: 'snack',
        });
    } catch (error) {
        console.log('UPDATE DIVISION ERROR: ', error);
        return next(error);
    }
};

const deleteDivision = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;

        const division = await db.divisions.findOne({ id });
        if (!division) {
            return res.send({
                status: 404,
                error: true,
                message: 'Division not found',
                notification_type: 'snack',
            });
        }

        const divisionHasTeams = await db.team_season_division.findOne({
            division_id: division.id,
        });
        if (divisionHasTeams) {
            return res.send({
                status: 409,
                error: true,
                message:
                    'Division cannot be deleted, there are teams in this division',
            });
        }

        const data = await db.divisions.update(
            { id },
            { deleted_at: new Date(), deleted_by: req.user.id }
        );
        return res.send({
            status: 200,
            data: data[0],
            message: 'Division deleted',
            notification_type: 'snack',
        });
    } catch (error) {
        console.log('DELETE DIVISION ERROR: ', error);
        return next(error);
    }
};

module.exports = {
    getAllDivisions,
    createDivision,
    updateDivision,
    deleteDivision,
};
