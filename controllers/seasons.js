const app = require('../server.js');


const getSeasons = async (req, res) => {
    const db = app.get('db');

    console.log(req.query, 'QUERYRYYY')
    
    if(Object.keys(req.query).length === 0){
        console.log('NO QURY')

        const data = await db.seasons.find({"deleted_date =": null, "hidden_date": null}).catch(err => console.log(err));
        return res.status(200).send({ status: 200, data, message: 'Retrieved list of seasons' })
    }

    var fields = []
    for (const key in req.query) {
        console.log(key, req.query[key])
        fields.push(key)
    }

    console.log(fields, 'fields!')
    // const data = await db.seasons.find({"deleted_date =": null}).catch(err => console.log(err));
    // return res.status(200).send({ status: 200, data, message: 'Retrieved list of seasons' })

    let newOne = {...req.query}

    console.log(newOne, 'NEW ONE BEORRREEE')
    if(newOne.show_hidden){
        console.log('yo')
        delete newOne.show_hidden;
        newOne['hidden_date !='] = null;
    } else {
        newOne['hidden_date ='] = null;
    }
    

    console.log(newOne, 'NEW ONE AFTER')
    // const whatev = !req.query.show_hidden && null;
    // let whatev;
    // if(!req.query.show_hidden){
    //     whatev = null;
    // }

    // let obj = {
    //     // ...req.query.type && {type: req.query.type} ,
    //     // ...!req.query.show_hidden && {'hidden_date =': null} ,

    //     'hidden_date !=': null
    // }


    // console.log(whatev,' whatever')
    const data = await db.seasons.find({
        "deleted_date =": null,
        ...newOne
        // ...obj
        // type: req.query.type,
        // ...req.query.type && {type: req.query.type} ,
        // ...!req.query.show_hidden && {'hidden_date =': null} ,
        // "hidden_date": whatev
        // "hidden_date =": !req.query.show_hidden && null 
        // ...req.query
    }).catch(err => console.log(err));


      console.log(data,' DAAATTTAAA')

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
