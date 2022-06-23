const app = require('../server');
// const helpers = require('./helpers');
const { buildWhere, buildOrderBy } = require('./helpers/sql');

// const createLimitFragment = (db, limit, offset) => {
//     if (offset) {
//         return db.query('LIMIT $1 OFFSET $2', [limit, offset]);
//     }
//     return db.query('LIMIT $1', limit);
// };


// const myQueryThing = (q = {}, allowable = []) => {
//     console.log('Q var from myQueryThing', q);
//     const newQuery = {};
//     for (let i = 0; i < allowable.length; i += 1) {
//         if (q[allowable[i]]) {
//             newQuery[allowable[i]] = q[allowable[i]];
//         }
//     }
//     return newQuery;
// };

// const myQueryThing = (q = {}, allowable = []) => {
//     console.log('Q var from myQueryThing', q);
//     const newQuery = {};
//     for (let i = 0; i < allowable.length; i += 1) {
//         // console.log(typeof allowable[i]);
//         // console.log(allowable[i]);
//         // console.log(q[allowable], 'q[allowable]');
//         const type = typeof allowable[i];
//         switch (type) {
//             case 'string':
//                 if (q[allowable[i]]) {
//                     newQuery[allowable[i]] = q[allowable[i]];
//                 }
//                 break;
//             case 'object':
//                 if (q[allowable[i].key]) {
//                     // console.log('HITTING LOL')
//                     // console.log(q[allowable[i].key])
//                     const queryValue = q[allowable[i].key];
//                     const checkForNull = allowable[i].checkNullable;
//                     if (checkForNull) {
//                         newQuery[allowable[i].column + (JSON.parse(queryValue) ? ' !=' : ' =')] = null;
//                     }
//                 }
//                 break;
//             default:
//                 break;
//         }
//         newQuery['deleted_at ='] = null;
//     }
//     return newQuery;
// };


// const librariesWithBooks = await db.libraries.join({
//     books: {
//         type: 'INNER',
//         on: { library_id: 'id' },
//     },
// }).find({
//     state: 'EV',
//     'books.author ILIKE': 'calvino, %',
// });


// TODO: massive js joins wont work because not able to select specifc
// fields or rename fields such as in the "raw" below. need to figure
// out to build a small where query builder to append to the RAW below


// const librariesWithBooks = await db.seasons.join({
//     users: {
//         type: 'INNER',
//         on: { id: 'created_by' },
//         // omit: true,
//         // columns: ['id', 'first_name']
//     },
// }).find({
//     ...bbb,
//     // state: 'EV',
//     // 'books.author ILIKE': 'calvino, %',
// }, {
//     // fields: { my_name: 'name' },
// });

// console.log({ librariesWithBooks });
// console.log(librariesWithBooks[0].users);


// EXAMPLE TO TRY

// function buildConditions(params) {
//     const conditions = [];
//     const values = [];
//     let conditionsStr;

//     if (typeof params.name !== 'undefined') {
//         conditions.push('name LIKE ?');
//         values.push(`%${params.name}%`);
//     }

//     if (typeof params.age !== 'undefined') {
//         conditions.push('age = ?');
//         values.push(parseInt(params.age));
//     }

//     return {
//         where: conditions.length
//             ? conditions.join(' AND ') : '1',
//         values,
//     };
// }

// const conditions = buildConditions(params);
// const sql = `SELECT * FROM table WHERE ${conditions.where}`;

// connection.query(sql, conditions.values, (err, results) => {
//     // do things
// });

// const buildWhere = (params) => {
//     const conditions = [];
//     const values = [];

//     if (!!params.type) {
//         conditions.push(`type = $${conditions.length + 1}`);
//         values.push(params.type);
//     }

//     if (!!params.show_hidden) {
//         conditions.push('hidden_at IS NOT null');
//     } else {
//         conditions.push('hidden_at IS null');
//     }

//     conditions.push('deleted_at IS null');

//     return [conditions.length ? conditions.join(' AND ') : '1', values];
// };

// function isOrIsNot(k) {
//     return [k === 'IS' ? 'IS' : 'IS NOT', k === 'IS' ? 'IS NOT' : 'IS'];
// }

// const buildWhereWithAllowable = (query = {}, allowable = []) => {
//     const conditions = [];
//     const values = [];

//     // TODO: figure out how to see if extra params are added that dont exist in "allowable"
//     // if so, need to return false, alerting the user that their query doesnt hae results

//     // example: url.com/seasons?hello=hi should return false because that query doesnt exist

//     console.log('\n');
//     for (let i = 0; i < allowable.length; i += 1) {
//         console.log('query', query);
//         console.log('allowable[i]', allowable[i]);
//         console.log('query[allowable[i]]', query[allowable[i].key], '\n');


//         if (allowable[i].nulls) {
//             conditions.push(`${allowable[i].column} ${(query[allowable[i].key] && JSON.parse(query[allowable[i].key])) ? `${isOrIsNot(allowable[i].nulls)[1]} null` : `${isOrIsNot(allowable[i].nulls)[0]} null`}`);
//             break;
//         }

//         if (query[allowable[i].key]) {
//             // if (allowable[i].column) {

//             //     if (allowable[i].nulls) {
//             //         console.log('here NULL')
//             //         console.log(JSON.parse(query[allowable[i].key]))

//             //         conditions.push(`${allowable[i].column} ${JSON.parse(query[allowable[i].key]) ? 'IS NOT null' : 'IS null'}`);
//             //         break;
//             //     }

//             //     conditions.push(`${allowable[i].column} = $${conditions.length + 1}`);
//             //     break;
//             // }


//             // if (allowable[i].nulls) {
//             //     console.log('here NULL')
//             //     console.log(JSON.parse(query[allowable[i].key]))

//             //     conditions.push(`${allowable[i].column} ${JSON.parse(query[allowable[i].key]) ? 'IS NOT null' : 'IS null'}`);
//             //     break;
//             // }

//             conditions.push(`${allowable[i].key} = $${conditions.length + 1}`);
//             values.push(query.type);


//             // TODO: figure out how to get this to work with dynamic values
//             // idea is to have one BUILDWHERE function that is dynamic for multple occasions


//         }
//     }


//     conditions.push('deleted_at IS null');

//     console.log(conditions,' conditions')

//     // console.log('-------------------------------')
//     // console.log(`WHERE ${conditions.join(' AND ')}`)

//     return [conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values];

//     // return [conditions.length ? conditions.join(' AND ') : '', values];
// };


// const getSeasons = async (req, res, next) => {
//     console.log(' \n \n ============================ \n \n');

//     console.log('REQ.QUERY', req.query);
//     try {
//         const db = app.get('db');
//         const allowableQueryKeys = [{ key: 'type' }, { key: 'show_hidden', column: 'hidden_at', nulls: 'IS' }];

//         const [WHERE, whereValues] = buildWhere(req.query, allowableQueryKeys);
//         const [ORDER_BY, orderByValues] = buildOrderBy(req.query, { by: 's.id', limit: 2, page: 1, dir: 'desc' }, whereValues.length);

//         const raw2 = `
//             select s.id, s.name, s.type, s.created_at, s.created_by, s.updated_at, s.updated_by, s.is_active, s.hidden_at,
//             cu.first_name AS created_by_first_name, cu.last_name AS created_by_last_name,
//             uu.first_name AS updated_by_first_name, uu.last_name AS updated_by_last_name
//             FROM seasons s
//             JOIN users cu ON cu.id = s.created_by
//             LEFT JOIN users uu ON uu.id = s.updated_by
//             ${WHERE}
//             ${ORDER_BY}
//         `;

//         const raw2Count = `
//             select count(*)
//             FROM seasons s
//             JOIN users cu ON cu.id = s.created_by
//             LEFT JOIN users uu ON uu.id = s.updated_by
//             ${WHERE}
//         `;
//         // -- order by s.id ${dir} limit $${builtQuery[1].length + 1} offset $${builtQuery[1].length + 2}
//         // order by s.id ${dir} limit $2 offset $3


//         console.log({WHERE, ORDER_BY})
//         console.log({whereValues, orderByValues})

//         console.log(raw2);

//         let seasonsWithBuiltQuery = [];
//         let seasonCOUNT = null;

//         console.log('raw coutn twooo: ', raw2Count)

//         if (!!ORDER_BY) {
//             seasonsWithBuiltQuery = await db.query(raw2, [...whereValues, ...orderByValues]);
//             const [bb] = await db.query(raw2Count, [...whereValues]);
//             console.log(bb, 'bbbbb')

//             seasonCOUNT = bb.count;
//         }

//         console.log({ seasonsWithBuiltQuery, seasonCOUNT });


//         console.log('\n');
//         console.log('\n');
//         console.log('\n');


//         // const query = helpers.filter(req.query);
//         // console.log('REQ.QUERY AFTER FILTER', query);

//         const { limit = 2, page = 1, dir = 'desc' } = req.query;

//         console.log(`LIMIT: ${limit}, PAGE: ${page}, DIR: ${dir}`);

//         const offset = null; (!page || page <= 1) ? 0 : (page - 1) * limit;
//         console.log('OFFSET', offset);
//         const total_count = 3; // await db.seasons.count({ ...query });
//         // const OLDQUERY = await db.seasons.find({
//         //     ...query,
//         // }, {
//         //     // fields: ['name'],
//         //     order: [{ field: 'id', direction: dir }],
//         //     offset,
//         //     limit,
//         // });


//         console.log('TOTAL_COUNT', total_count);

//         // console.log(query, ' querrryyy helper');

//         // select s.id, s.name, s.type, s.created_at, s.created_by, s.updated_at, s.updated_by, s.is_active, s.hidden_at,
//         // u.first_name, u.last_name, u.id AS user_id from seasons s
//         // join users u on u.id = s.created_by
//         // where hidden_at IS null AND deleted_at IS null
//         // order by s.id ${dir} limit $2 offset $3
//         const raw = `
//             select s.id, s.name, s.type, s.created_at, s.created_by, s.updated_at, s.updated_by, s.is_active, s.hidden_at,
//             cu.first_name AS created_by_first_name, cu.last_name AS created_by_last_name,
//             uu.first_name AS updated_by_first_name, uu.last_name AS updated_by_last_name
//             from seasons s
//             join users cu on cu.id = s.created_by
//             left join users uu on uu.id = s.updated_by
//             where hidden_at ${req.query.show_hidden ? 'IS NOT null' : 'IS null'} AND deleted_at IS null
//             order by s.id ${dir} limit $2 offset $3
//         `;

//         const seasons = await db.query(raw, [dir, limit, offset]);

//         // console.log(seasons, 'new uqery')

//         const total_pages = Math.ceil(total_count / limit);
//         console.log({ total_count: parseInt(total_count), seasons_length: seasons.length, total_pages, page: parseInt(page) });

//         // return res.send({ status: 200, data: { seasons, pagination: { total_count: parseInt(total_count), total_pages, page: parseInt(page) } }, message: 'Retrieved list of seasons', notification_type: 'hi', notification: { type: 'toast', duration: 2, status: 'error' } });
//         return res.send({ status: 200, data: { seasons, pagination: { total_count: parseInt(total_count), total_pages, page: parseInt(page) } }, message: 'Retrieved list of seasons' });
//     } catch (error) {
//         console.log('GET SEASONS ERROR: ', error);
//         return next(error);
//     }
// };


const getSeasons = async (req, res, next) => {
    console.log(' \n \n ============================ \n \n');

    console.log('REQ.QUERY', req.query);
    try {
        const db = app.get('db');
        const allowableQueryKeys = [{ key: 'type' }, { key: 'show_hidden', column: 'hidden_at', nulls: 'IS' }, { key: 'search', columns: ['type', 'name'] }];

        const [WHERE, whereValues] = buildWhere(req.query, allowableQueryKeys);
        const [ORDER_BY, orderByValues, { limit: limite2, page: page2 }] = buildOrderBy(req.query, { by: 's.id', limit: 3, page: 1, dir: 'desc' }, whereValues.length);

        const raw2 = `
            select s.id, s.name, s.type, s.created_at, s.created_by, s.updated_at, s.updated_by, s.is_active, s.hidden_at,
            cu.first_name AS created_by_first_name, cu.last_name AS created_by_last_name,
            uu.first_name AS updated_by_first_name, uu.last_name AS updated_by_last_name
            FROM seasons s
            JOIN users cu ON cu.id = s.created_by
            LEFT JOIN users uu ON uu.id = s.updated_by
            ${WHERE}
            ${ORDER_BY}
        `;

        const raw2Count = `
            select count(*)
            FROM seasons s
            JOIN users cu ON cu.id = s.created_by
            LEFT JOIN users uu ON uu.id = s.updated_by
            ${WHERE}
        `;


        // console.log({ WHERE, ORDER_BY });
        // console.log({ whereValues, orderByValues, limite2 });

        console.log(raw2);

        let seasonsWithBuiltQuery = [];
        let seasonCOUNT = 0;

        // console.log('raw coutn twooo: ', raw2Count);

        if (!!ORDER_BY) {
            seasonsWithBuiltQuery = await db.query(raw2, [...whereValues, ...orderByValues]);
            const [bb] = await db.query(raw2Count, [...whereValues]);
            // console.log(bb, 'bbbbb');

            seasonCOUNT = bb.count;
        }

        // console.log({ seasonsWithBuiltQuery, seasonCOUNT });
        const total_pages2 = Math.ceil(seasonCOUNT / limite2);
        // console.log(total_pages2, 'total_pages2');

        // console.log('\n');
        // console.log('\n');
        // console.log('\n');

        // console.log({ total_count: parseInt(seasonCOUNT), current_count: seasonsWithBuiltQuery.length, total_pages2, page: parseInt(page2) });

        // return res.send({ status: 200, data: { seasons, pagination: { total_count: parseInt(total_count), total_pages, page: parseInt(page) } }, message: 'Retrieved list of seasons', notification_type: 'hi', notification: { type: 'toast', duration: 2, status: 'error' } });
        return res.send({ status: 200, data: { seasons: seasonsWithBuiltQuery, pagination: { total_count: parseInt(seasonCOUNT), limit: limite2, total_pages: total_pages2, page: parseInt(page2) } }, message: 'Retrieved list of seasons' });
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
            const inlineErrors = {
                name: 'Season already exists',
                // start_date: 'Invalid date',
            };

            return res.send({ status: 400, data: { errors: inlineErrors }, message: 'Season already exists' });
        }

        const data = await db.seasons.insert({ name, type, is_active: false, created_at: new Date(), created_by: req.user.id });
        return res.send({ status: 200, data, message: 'Season created', notification: { type: 'toast', duration: 3, status: 'success' } });
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
        // eslint-disable-next-line no-prototype-builtins
        if (req.body.hasOwnProperty('is_hidden')) {
            if (season.is_active) {
                return res.send({ status: 409, data: [], message: 'Cannot hide the currently active season', notification_type: 'snack' });
            }
            const data = await db.seasons.update({ id }, is_hidden ? { hidden_at: new Date(), hidden_by: req.user.id } : { hidden_at: null, hidden_by: null });
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

        const data = await db.seasons.update({ id }, { name, type, is_active, updated_at: new Date(), updated_by: req.user.id });
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

        const data = await db.seasons.update({ id }, { deleted_at: new Date(), deleted_by: req.user.id });
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
