
const app = require('../server.js');


const getBlogs = async (req, res) => {
    const db = app.get('db');
    const data = await db.query('select * from blog order by id desc');
    // console.log(data, 'blogs!')
    res.status(200).send({ status: 200, data, message: 'Retrieved list of blogs' })
}



const getBlogById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.query('select * from blog where id = $1', [id]);
    // console.log(data, 'blogs!')
    if (!data) {
        return res.status(404).send({ status: 404, data: [], message: 'Blog cannot be found' })
    }
    res.status(200).send({ status: 200, data, message: 'Retrieved blogs' })
}


module.exports = {
    getBlogs,
    getBlogById
}