
const app = require('../server.js');


const getNews = async (req, res) => {
    const db = app.get('db');
    const data = await db.query('select news.id, news.title, news.allow_collapse, news.tag, news.body, news.created_by, news.created_date, users.id as user_id, users.first_name, users.last_name from news JOIN users ON news.created_by = users.id order by news.id desc ');
    res.status(200).send({ status: 200, data, message: 'Retrieved list of news' })
}



const getNewsById = async (req, res) => {
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
    getNews,
    getNewsById
}