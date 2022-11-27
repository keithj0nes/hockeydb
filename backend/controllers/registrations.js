const jwt = require('jsonwebtoken');
const app = require('../server');

const { JWT_SECRET } = process.env;

const getRegistration = async (req, res) => {
    const db = app.get('db');
    const { params: { registration_id }, user } = req;

    // TODO: this shoudl be responsible for getting everything for this specific registration id
    // aka add documents / waivers / fees etc

    // select lsff.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id from "registrations_fields" lsff
    // join "registrations_templates" rtba on rtba.id = lsff.registration_template_id
    // where registration_template_id = $1 ORDER BY display_index;

    // SELECT lsff.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id from "registrations_fields" lsff
    // join "registrations_templates" rtba on rtba.id = lsff.registration_template_id
    // where registration_template_id = $1 ORDER BY display_index;
    const rawReg = `
        SELECT rf.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id FROM "registrations_fields" rf
        JOIN "registrations_templates" rt ON rt.id = rf.registration_template_id
        WHERE registration_template_id = $1 ORDER BY display_index;
    `;

    const rawRegModel = `
        SELECT 
            DISTINCT rtba.*,
            (SELECT  COUNT(*) FROM "registrations_submissions" WHERE registration_template_id = rtba.id AND submitted_at IS NOT NULL) AS filled_spots
        FROM "registrations_templates" rtba
        JOIN "registrations_submissions" r ON r.registration_template_id = rtba.id
        WHERE rtba.id = $1;
    `;

    const registration_fields = await db.query(rawReg, [registration_id]);
    const [model] = await db.query(rawRegModel, [registration_id]);
    const registered_players = await db.registrations_submissions.find({ user_id: user.id, registration_template_id: registration_id }, {
        order: [{ field: 'id' }],
    });

    const registrationModel = { ...model, registration_fields, registered_players };

    return res.send({ status: 200, data: registrationModel, message: 'Retrieved registration' });
};

const getOpenRegistrations = async (req, res) => {
    const db = app.get('db');

    // const q = `
    //     SELECT
    //         r.id AS registration_id, r.user_id, r.player_id, r.submitted_at, r.registration_template_id,
    //         rtba.name, rtba.is_open, rtba.season_id
    //     FROM "registrations_submissions" r
    //     JOIN "registrations_templates" rtba ON rtba.id = r.registration_template_id
    //     WHERE user_id = $1;
    // `;

    const q = `
        SELECT
            CONCAT(p.first_name, ' ', p.last_name) AS full_name,
            r.id AS registration_id, r.user_id, r.player_id, r.submitted_at, r.registration_template_id,
            rtba.name, rtba.is_open, rtba.season_id
        FROM "registrations_submissions" r
        JOIN "registrations_templates" rtba ON rtba.id = r.registration_template_id
        JOIN players p ON p.id = r.player_id
        WHERE user_id = $1 AND submitted_at IS NOT NULL;
    `;

    const qq = `
        SELECT 
            DISTINCT rtba.*,
            (SELECT  COUNT(*) FROM "registrations_submissions" WHERE registration_template_id = rtba.id AND submitted_at IS NOT NULL) AS filled_spots
        FROM "registrations_templates" rtba
        JOIN "registrations_submissions" r ON r.registration_template_id = rtba.id
        WHERE is_open = true;
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

    // console.log('getting getRegistrationByRegIdAdmin', { season_id, registration_id });

    const rawReg = `
        select lsff.id AS field_id, field_type, label, hint, options, is_required, display_index, section_display_index, locked, section, registration_template_id from "registrations_fields" lsff
        join "registrations_templates" rtba on rtba.id = lsff.registration_template_id
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

        const currentRegistration = await db.registrations_templates.findOne({ id: registration_id, season_id });

        if (!currentRegistration) {
            return res.send({ status: 404, error: true, message: 'Registation not found', notification: { type: 'toast', duration: 2, status: 'error' } });
        }

        let deleted = [];

        if (removedIds.length) {
            deleted = await Promise.all(removedIds.map(async item => {
                await db.registrations_fields.save({ id: item, label: `REMOVED-${item}` });
                return item;
            }));
        }

        const upsertFields = await Promise.all(fields.map(async item => {
            const { field_id, locked, registration_template_id: rid, ...rest } = item;
            return db.registrations_fields.save({ ...(field_id ? { id: field_id } : {}), registration_template_id: registration_id, ...rest });
        }));

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
    const foundRegistration = await db.registrations_templates.where('lower(name) = $1', [name.toLowerCase()]);

    if (!!foundRegistration.length) {
        const inlineErrors = { name: 'Registration name already exists' };
        return res.send({ status: 400, errors: inlineErrors, message: 'Registration name already exists' });
    }

    // const data = await db.template_registrations.insert({ name, created_at: new Date(), created_by: req.user.id, season_id });
    const data = await db.registrations_templates.insert({ name, created_at: new Date(), created_by: req.user.id, season_id });


    // TODO: if not creating from previous template, copy default form fields into this new registration

    if (!shouldUseTemplate) {
        const query = `
            INSERT INTO "registrations_fields" (field_type, label, hint, options, locked, is_required, registration_template_id, section, section_display_index, display_index)
            SELECT field_type, label, hint, options, locked, is_required, $1, section, section_display_index, 1 FROM "registrations_default_fields"
            ORDER BY id;
        `;


        const addDefaultFormFieldsToNewRegistration = await db.query(query, [data.id]);

        console.log(addDefaultFormFieldsToNewRegistration, 'addDefaultFormFieldsToNewRegistration');
    }


    console.log(data, 'datadat datamdata dataa');

    return res.send({ status: 200, data, message: 'Created Registration' });
};


const updatePlayerRegistration = async (req, res) => {
    const db = app.get('db');

    console.log('updating player registration ');

    const { body, params, user } = req;
    console.log({ body, params });

    const todaysDate = new Date();
    const totalStepsCount = 3;


    // let currentSub;
    let submission_deets;

    const q = `
        SELECT * FROM registrations_submissions
        where value ->> 'register-as'::text = $1;
    `;
    const [currentSub] = await db.query(q, [body.fields['register-as']]);

    console.log(currentSub, 'currentSub');

    // return res.send({ status: 200, data: [], message: 'Updated Registration' });


    const isNotAPlayer = body.fields['register-as'].startsWith('_');
    console.log({ isNotAPlayer });

    let player;
    if (!isNotAPlayer) {
        player = await db.players.findOne({ id: currentSub?.player_id || body.fields['register-as'] });
    }
    // console.log(player, 'plaayeerrr');

    // return res.send({ status: 200, data: [], message: 'Updated Registration' });

    // CREATE SUBMISSION
    if (!currentSub) {
        console.log('CREATING SUBMISSION');


        submission_deets = await db.registrations_submissions.insert({ user_id: user.id, registration_template_id: params.registration_id, value: body.fields, player_id: player?.id, created_at: todaysDate, step: body.step });
        console.log(submission_deets, 'submission_deets!! 1');
        return res.send({ status: 200, data: submission_deets, message: 'CREATED Registration' });
    }

    // console.log(body.fields['submission-key'], "body.fields['submission-key']");

    // SUBMIT SUBMISSION
    if (!!currentSub && totalStepsCount === body.step) {
        console.log('SUBMITTING SUBMISSION');
        const step = body.step > currentSub.step ? body.step : currentSub.step;

        if (isNotAPlayer) {
            // CREATE PLAYER HERE
            const { 'First Name': first_name, 'Last Name': last_name } = body.fields;
            player = await db.players.insert({ first_name, last_name, created_at: todaysDate, created_by: user.id, parent_id: user.id });
        }


        submission_deets = await db.registrations_submissions.update({ id: currentSub.id }, { player_id: player.id, value: body.fields, submitted_at: todaysDate, step });

        console.log(submission_deets, 'submission_deets');


        const associated_accounts = await db.players.find({ parent_id: user.id });
        const season = await db.seasons.findOne({ is_active: true });
        const access_token = jwt.sign({ user: { ...user, associated_accounts }, season }, JWT_SECRET);

        return res.send({ status: 200, data: { user: { ...user, associated_accounts }, access_token, submitted: true, submission: submission_deets[0] }, message: 'SUBMITTING Registration' });

        // return res.send({ status: 200, data: [], message: 'SUBMITTING Registration' });
    }


    // UPDATE SUBMISSION
    if (!!body.fields['register-as'] && !!currentSub) {
        console.log('UPDATING SUBMISSION');
        const step = body.step > currentSub.step ? body.step : currentSub.step;

        submission_deets = await db.registrations_submissions.update({ id: currentSub.id }, { value: body.fields, updated_at: todaysDate, step });
        return res.send({ status: 200, data: submission_deets, message: 'UPDATED Registration' });
    }


    // console.log(currentSub, 'currentSub querrryyy');
    // console.log(submission_deets, 'submission_deets!! 2')


    // if (!submission_id) {
    //     insert (created_at)
    // }

    // let submission_deets;

    // if (!body.submission_id) {
    //     submission_deets = await db.registrations_submissions.insert({ user_id: user.id, registration_template_id: params.registration_id, value: body.fields, created_at: todaysDate, step: body.step });
    // }

    // console.log(submission_deets, 'submission_deets!!')


    // if there's no player, and user is still creating registration,
    // store as key value in db.registrations_submissions "value" json
    // - create player only when user submits the registration


    // TODO: look up how to search through json object in database
    // need to find the registration_submission if using method above

    // psuedo code
    // if (user submission)
    //     insert (created_at)
    // if (user submission)
    //     update (updated_at)
    // if (user submission && laststep / paid)
    //     update (submitted_at)

    // const inserted = await db.registrations_submissions.insert({ user_id: user.id, registration_template_id: params.registration_id, value: body.fields, created_at: todaysDate, step: body.step });
    // console.log(inserted, 'inserted!!')

    return res.send({ status: 200, data: [], message: 'Updated Registration' });
};

const submitPlayerRegistration = async (req, res) => {
    console.log('SUBMITTING REGISTRATION!!!!');

    return updatePlayerRegistration(req, res);

    // console.log(req.body, req.params, req.user, 'req body');

    // const db = app.get('db');
    // const { body, params, user } = req;
    // const todaysDate = new Date();
    // let playerr;

    // if (Number(body.fields['register-as']) === user.id) {
    //     [playerr] = await db.query('select * from players where created_by = $1 and parent_id is null', [user.id]);
    // } else {
    //     [playerr] = await db.query('select * from players where parent_id = $1 and id = $2;', [user.id, body.fields['register-as']]);
    // }

    // console.log(playerr, 'player');

    // if (!playerr) {
    //     playerr = await db.players.insert({ first_name: body.fields['First Name'], last_name: body.fields['Last Name'], created_at: todaysDate, created_by: user.id, parent_id: Number(body.fields['register-as']) !== user.id ? user.id : null });
    //     console.log(playerr, 'NEW USER');
    // }

    // const inserted = await db.registrations_submissions.insert({ user_id: user.id, player_id: playerr.id, registration_template_id: params.registration_id, value: body.fields, created_at: todaysDate, submitted_at: todaysDate });
    // console.log(inserted, 'inserted!!');

    // // const query = `
    // //     SELECT DISTINCT t.name AS previous_team, p.* FROM "registrations_submissions" r
    // //     JOIN players p ON p.id = r.player_id
    // //     LEFT JOIN player_team_season pt ON pt.player_id = p.id
    // //     LEFT JOIN teams t ON t.id = pt.team_id
    // //     WHERE p.parent_id = $1;
    // // `;

    // // const associated_accounts = await db.query(query, [user.id]);
    // const associated_accounts = await db.players.find({ parent_id: user.id });
    // // console.log(user, 'user')
    // // console.log(associated_accounts, 'associated_accounts')
    // // console.log({ ...user, associated_accounts });
    // const season = await db.seasons.findOne({ is_active: true });
    // const access_token = jwt.sign({ user: { ...user, associated_accounts }, season }, JWT_SECRET);

    // return res.send({ status: 200, data: { user: { ...user, associated_accounts }, access_token }, message: 'Submitted Registration' });

    // return res.send({ status: 200, data: { ...user, associated_accounts }, message: 'Submitted Registration' });
};


module.exports = {
    getRegistration,
    getOpenRegistrations,
    getRegistrationByRegIdAdmin,
    createRegistration,
    updateRegistrationFields,
    submitPlayerRegistration,
    updatePlayerRegistration,
};
