const app = require('../server');


const getRegistration = async (req, res) => {
    const db = app.get('db');
    const { registration_id } = req.params;

    // TODO: this shoudl be responsible for getting everything for this specific registration id
    // aka add documents / waivers / fees etc

    console.log('getting getRegistration', { registration_id });

    const rawReg = `
        select lsff.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id from "_LEAGUE_SEASON_FORM_FIELDS" lsff
        join "_REGISTRATION_TEMPLATE_BY_ADMIN" rtba on rtba.id = lsff.registration_template_id
        where registration_template_id = $1 ORDER BY display_index;
    `;

    const reg = await db.query(rawReg, [registration_id]);


    return res.send({ status: 200, data: reg, message: 'Retrieved registration' });
};

const getOpenRegistrations = async (req, res) => {
    const db = app.get('db');

    // const open_registrations = await db._REGISTRATION_TEMPLATE_BY_ADMIN.find({ is_open: true });
    // const my_registrations = await db._USER_FORM_SUBMISSION_AKA_REGISTRATIONS.find({ user_id: 4 });

    const qq = `
        SELECT 
            DISTINCT rtba.*,
            (SELECT  COUNT(*) FROM "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" WHERE registration_template_id = rtba.id) AS filled_spots
        FROM "_REGISTRATION_TEMPLATE_BY_ADMIN" rtba
        JOIN "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" r ON r.registration_template_id = rtba.id
        WHERE is_open = true;
    `;

    const q = `
        SELECT 
            r.id AS registration_id, r.user_id, r.player_id, r.submitted_at, r.registration_template_id,
            rtba.name, rtba.is_open, rtba.season_id
        FROM "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" r
        JOIN "_REGISTRATION_TEMPLATE_BY_ADMIN" rtba ON rtba.id = r.registration_template_id
        WHERE user_id = $1;
    `;

    const my_registrations = await db.query(q, [req.user.id]);
    const open_registrations = await db.query(qq);

    return res.send({ status: 200, data: { open_registrations, my_registrations }, message: 'Retrieved list of Registrations' });
};

const getRegistrationByRegIdAdmin = async (req, res) => {
    const db = app.get('db');
    const { season_id, registration_id } = req.params;

    // TODO: this shoudl be responsible for getting everything for this specific registration id
    // aka add documents / waivers / fees etc

    console.log('getting getRegistrationByRegIdAdmin', { season_id, registration_id });

    const rawReg = `
        select lsff.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id from "_LEAGUE_SEASON_FORM_FIELDS" lsff
        join "_REGISTRATION_TEMPLATE_BY_ADMIN" rtba on rtba.id = lsff.registration_template_id
        where registration_template_id = $2 AND season_id = $1 ORDER BY display_index;
    `;

    const reg = await db.query(rawReg, [season_id, registration_id]);

    return res.send({ status: 200, data: reg, message: 'Retrieved registration' });
};


const updateRegistrationFields = async (req, res, next) => {
    try {
        const db = app.get('db');

        const { registration_id, fields, removedIds } = req.body;
        const { season_id } = req.params;


        // console.log({ registration_id, season_id, fields, removedIds }, '{ registration_id, season_id, fields, removedIds }');


        const currentRegistration = await db._REGISTRATION_TEMPLATE_BY_ADMIN.findOne({ id: registration_id, season_id });

        // console.log(currentRegistration, 'current regirstaiton');

        if (!currentRegistration) {
            return res.send({ status: 404, error: true, message: 'Registation not found', notification: { type: 'toast', duration: 2, status: 'error' } });
        }

        let deleted = [];

        if (removedIds.length) {
            deleted = await Promise.all(removedIds.map(async item => {
                console.log(item, 'itemmmm');
                // const { field_id, locked, registration_template_id: rid, ...rest } = item;
                // return db._LEAGUE_SEASON_FORM_FIELDS.save({ id: item, label: `REMOVED-${item}` });
                // return db._LEAGUE_SEASON_FORM_FIELDS.destroy(item);

                await db._LEAGUE_SEASON_FORM_FIELDS.save({ id: item, label: `REMOVED-${item}` });
                return item;
            }));

            console.log({ deleted });
        }

        // console.log(arrayOfObj, 'ARR OF OBJEC')
        // const upsertFields = await Promise.all(arrayOfObj.map(async item => {
        //     const { field_id, locked, registration_template_id: rid, ...rest } = item;
        //     return db._LEAGUE_SEASON_FORM_FIELDS.save({ ...(field_id ? { id: field_id } : {}), registration_template_id: registration_id, ...rest });
        // }));

        const upsertFields = await Promise.all(fields.map(async item => {
            const { field_id, locked, registration_template_id: rid, ...rest } = item;
            return db._LEAGUE_SEASON_FORM_FIELDS.save({ ...(field_id ? { id: field_id } : {}), registration_template_id: registration_id, ...rest });
        }));

        // console.log({ upsertFields });


        return res.send({ status: 200, data: { fields: upsertFields, deleted }, message: 'Registration Updated' });
    } catch (error) {
        console.log('updateRegistrationFields ERROR: ', error);
        return next(error);
    }
};


const createRegistration = async (req, res) => {
    const db = app.get('db');
    console.log('creating REGISTRATION!!!!');
    console.log(req.body, 'req body');

    const shouldUseTemplate = false;

    const { name } = req.body;
    const { season_id } = req.params;

    // const { name, duplicate_from, season_id } = req.body;


    // TODO:
    // store name to template_registrations table
    // return newly added row's id to frontend
    // frontend will redirect to registration/:id to continue building registration

    // const foundRegistration = await db.template_registrations.where('lower(name) = $1', [name.toLowerCase()]);
    const foundRegistration = await db._REGISTRATION_TEMPLATE_BY_ADMIN.where('lower(name) = $1', [name.toLowerCase()]);

    if (!!foundRegistration.length) {
        const inlineErrors = { name: 'Registration name already exists' };
        return res.send({ status: 400, errors: inlineErrors, message: 'Registration name already exists' });
    }

    // const data = await db.template_registrations.insert({ name, created_at: new Date(), created_by: req.user.id, season_id });
    const data = await db._REGISTRATION_TEMPLATE_BY_ADMIN.insert({ name, created_at: new Date(), created_by: req.user.id, season_id });


    // TODO: if not creating from previous template, copy default form fields into this new registration

    if (!shouldUseTemplate) {
        const query = `
            INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" (field_type, label, hint, options, locked, is_required, registration_template_id, section, section_display_index, display_index)
            SELECT field_type, label, hint, options, locked, is_required, $1, section, section_display_index, 1 FROM "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS"
            ORDER BY id;
        `;


        const addDefaultFormFieldsToNewRegistration = await db.query(query, [data.id]);

        console.log(addDefaultFormFieldsToNewRegistration, 'addDefaultFormFieldsToNewRegistration');
    }


    console.log(data, 'datadat datamdata dataa');

    return res.send({ status: 200, data, message: 'Created Registration' });
};

const submitPlayerRegistration = async (req, res) => {
    const db = app.get('db');
    console.log('SUBMITTING REGISTRATION!!!!');
    console.log(req.body, req.params, 'req body');
};

module.exports = {
    getRegistration,
    getOpenRegistrations,
    getRegistrationByRegIdAdmin,
    createRegistration,
    updateRegistrationFields,
    submitPlayerRegistration,
};
