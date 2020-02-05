const app = require('../server.js');

const filter = (query) => {
    const q = {...query};
    if(q.show_hidden){
        delete q.show_hidden;
        q['hidden_date !='] = null;
    } else {
        q['hidden_date ='] = null;
    }
    q["deleted_date ="] = null;
    return q;
}

const getSeasons = async (req, res) => {
    const db = app.get('db');

    console.log(req.query, 'QUERYRYYY')

    const query = filter(req.query);

    const data = await db.seasons.find({...query}).catch(err => console.log(err));

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
