
const app = require('../server.js');


const getBlogs = async (req, res) => {
    const db = app.get('db');
    const data = await db.query('select blog.id, blog.message, blog.created_by, blog.created_date, users.id as user_id, users.first_name, users.last_name from blog JOIN users ON blog.created_by = users.id order by blog.id desc ');
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