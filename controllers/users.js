const app = require('../server.js');
const helpers = require('./helpers');

const getUsers = async (req, res) => {
    const db = app.get('db');
  
    // console.log(req.query, 'QUERYRYYY')
    getUsers2(req, res);

    const newQuery = {};

    // this is not dynamic at all. need to clean this up

    newQuery.is_suspended = req.query['active'] ? 'IS NULL' : req.query['inactive'] ? 'IS NOT NULL' : '';
    if((req.query['active'] && req.query['inactive']) || (!req.query['active'] && !req.query['inactive']) ) {
        delete newQuery.is_suspended
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

    if(newQueryArr.length > 0) {
        myNewStuffz += ' WHERE'

        newQueryArr.map((item, ind) => {
            myNewStuffz += `${ind > 0 ? ' AND ' : ''} ${item} ${newQuery[item]}`
        })
    }

    // console.log(myNewStuffz, 'haha')


    // console.log(query,' QUERY')
  
    // const data = await db.users.find();
    // const [ err, data ] = await helpers.tryCatch(db.users.find({...query}, { order: [ {field: 'id', direction: 'desc'}]}))
    const [ err, data ] = await helpers.tryCatch(db.query(myNewStuffz));

    if(err) {
        return console.log(err, 'ERRORRRRRR 😎')
        // return res.status(200).send({ status: 404, data: [], message: 'An error occured with the query', redirect: 'current' });
    }
    
    // console.log(data, 'USER DATTAAA!')

    res.status(200).send({ status: 200, data, message: 'Retrieved list of Users' });
  }

const getUsers2 = async (req, res) => {
    // try {
    //     const db = app.get('db');
    //     const query = helpers.filter(req.query, ['hidden_date =', 'deleted_date =']);
    //     // const defaults = {
    //     //     is_suspended: null,
    //     // }
    //     console.log({query: req.query})
    //     const { limit = 50, page = 1, dir = 'asc' } = req.query;
    //     const offset = (!page || page <= 1) ? 0 : (page-1) * limit;
    //     const total_count = await db.users.count({ ...query });

    //     const users = await db.users.find({
    //         ...query
    //     }, {
    //         order: [{field: 'id', direction: dir }],
    //         offset,
    //         limit,
    //     });

    //     console.log({total_count})



        
    // } catch (error) {
    //     console.log(error, 'error getuserers2222')
    // }
}


module.exports = {
    getUsers,
    // getUsersById
}
