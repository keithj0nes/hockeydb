const app = require('../server.js');


const getSeasons = async (req, res) => {
    const db = app.get('db');
    // const data = await db.query('select blog.id, blog.message, blog.created_by, blog.created_date, users.id as user_id, users.first_name, users.last_name from blog JOIN users ON blog.created_by = users.id order by blog.id desc ');
    const data = await db.seasons.find({"deleted_date =": null}).catch(err => console.log(err));
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
