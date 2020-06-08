const app = require('../server.js');
const helpers = require('./helpers');

const getSeasons = async (req, res) => {
    const db = app.get('db');
    // let hasErrors = false;

    console.log(req.query, 'QUERYRYYY')

    const query = helpers.filter(req.query);

    // const data = await db.seasons.find({...query}, { order: [ {field: 'id', direction: 'desc'}]}).catch(err => console.log(err, 'THIS IS AN ERROR 🛑🛑🛑🛑'));

    // const data = await db.seasons.find({...query}, { order: [ {field: 'id', direction: 'desc'}]})
    //     // .catch(err => res.status(200).send({ status: 200, data: [], message: 'an error occured'}));
    //     .catch(err => {
    //         hasErrors = true
    //         return res.status(200).send({ status: 200, data: [], message: 'an error occured'});

    //     });

    //
    //      NEED TO FIGURE OUT A GOOD WAY TO HANDLE ERRORS FOR THINGS SUCH AS QUERYING TABLE COLUMNS THAT DONT EXIST -
    //      THIS IS OK FOR SINGLE CALL BUT SOME GETS HAVE MULTPLE DB.FINDS
    //      this error will redirect to the same page without url query params
    //

    const [ err, data ] = await helpers.tryCatch(db.seasons.find({...query}, { order: [ {field: 'id', direction: 'desc'}]}))

    if(err) {
        console.log(err, 'ERRORRRRRR 😎')
        return res.status(200).send({ status: 404, data: [], message: 'An error occured with the query', redirect: 'current' });
    }
    
    console.log(data, 'dta!')
    // if(hasErrors) {
    //     return res.status(200).send({ status: 200, data: [], message: 'an error occured'});
    // }

    res.status(200).send({ status: 200, data, message: 'Retrieved list of seasons' })
}




const getSeasonById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.query('select * from blog where id = $1', [id]);
    // console.log(data, 'blogs!')
    if (!data) {
        return res.status(404).send({ status: 404, data: [], message: 'Blog cannot be found' })
    }
    res.status(200).send({ status: 200, data, message: `Retrieved season ${data.id}`})
}


module.exports = {
    getSeasons,
    getSeasonById
}




// Comparison

//     = (equality): {price: 20}, {"price =": 20}
//     <> (inequality): {"price <>": 20}, {"price !=": 20}, {"price !": 20}
//     < (less than): {"price <": 20}
//     > (greater than): {"price >": 20}
//     <= (less than or equal): {"price <=": 20}
//     >= (greater than or equal): {"price >=": 20}
