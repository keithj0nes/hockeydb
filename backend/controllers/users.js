const app = require('../server.js');
const helpers = require('./helpers');

const getUsers = async (req, res) => {
    const db = app.get('db');

    const newQuery = {};

    // this is not dynamic at all. need to clean this up

    newQuery.is_suspended = req.query.active ? 'IS NULL' : req.query.inactive ? 'IS NOT NULL' : '';
    if ((req.query.active && req.query.inactive) || (!req.query.active && !req.query.inactive)) {
        delete newQuery.is_suspended;
    }

    // newQuery.invite_token = req.query['default'] ? 'IS NULL' : req.query['modified'] ? 'IS NOT NULL' : '';
    // if((req.query['default'] && req.query['modified']) || (!req.query['default'] && !req.query['modified']) ) {
    //     delete newQuery.invite_token
    // }

    // console.log(newQuery, 'NEW QUERRRYYY')

    // const query = helpers.filter(newQuery, ['hidden_date =', 'deleted_date =']);

    let myNewStuffz = `
        SELECT *, 
        CONCAT (first_name, ' ', last_name) AS full_name, 
        CASE
            when is_suspended = true then 'inactive'
            when invite_date is not null and last_login is null then 'invited'
            when reinvite_date is not null then 'reinvited'
            else 'active'
            END as status 
        FROM USERS`;

    const newQueryArr = Object.keys(newQuery);

    if (newQueryArr.length > 0) {
        myNewStuffz += ' WHERE';

        newQueryArr.map((item, ind) => myNewStuffz += `${ind > 0 ? ' AND ' : ''} ${item} ${newQuery[item]}`);
    }

    // console.log(myNewStuffz, 'haha')


    // console.log(query,' QUERY')

    // const data = await db.users.find();
    // const [ err, data ] = await helpers.tryCatch(db.users.find({...query}, { order: [ {field: 'id', direction: 'desc'}]}))
    const [err, data] = await helpers.tryCatch(db.query(myNewStuffz));

    if (err) {
        return console.log(err, 'ERRORRRRRR 😎');
        // return res.send({ status: 404, data: [], message: 'An error occured with the query', redirect: 'current' });
    }

    // console.log(data, 'USER DATTAAA!')

    res.send({ status: 200, data, message: 'Retrieved list of Users' });
};

module.exports = {
    getUsers,
    // getUsersById
};
