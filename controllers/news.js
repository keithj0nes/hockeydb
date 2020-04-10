
const app = require('../server.js');
const config = require('../config.js');

// function sendFormat({res, status, code, message, data}) {
//     const date = new Date();
//     return res.status(200).send({
//         "site": config.SITE_URL,
//         "version": config.API_VERSION,
//         "datetime": date,
//         "timestamp": date.getTime(),
//         "status": status,
//         "code": code,
//         "message": message,
//         "data": data
//     })
// }

const getNews = async (req, res) => {
    const db = app.get('db');
    const news = await db.query('select news.id, news.display_order, news.title, news.allow_collapse, news.tag, news.body, news.created_by, news.created_date, users.id as user_id, users.first_name, users.last_name from news JOIN users ON news.created_by = users.id order by display_order ');
    // const news = await db.query('select news.id, news.title, news.allow_collapse, news.tag, news.body, news.created_by, news.created_date, users.id as user_id, users.first_name, users.last_name from news JOIN users ON news.created_by = users.id order by news.id desc ');
    const todays_games = await db.get_todays_games();
    res.status(200).send({ status: 200, data: {news, todays_games}, message: 'Retrieved list of news' })
    // return sendFormat({res, status: 200, data: { news, todays_games }, message: 'Retrieved list of news'})
}




const getNewsById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const data = await db.query('select news.id, news.display_order, news.title, news.allow_collapse, news.tag, news.body, news.created_by, news.created_date, users.id as user_id, users.first_name, users.last_name from news JOIN users ON news.created_by = users.id where news.id = $1', [id]);
    // console.log(data, 'blogs!')
    if (!data) {
        return res.status(200).send({ status: 404, data: [], message: 'News post cannot be found' })
    }
    res.status(200).send({ status: 200, data: data[0], message: 'Retrieved news post' })
}


module.exports = {
    getNews,
    getNewsById
}