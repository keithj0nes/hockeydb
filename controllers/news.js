const app = require('../server.js');

const getNews = async (req, res) => {
    const db = app.get('db');
    // coalesce function below will return an empty array of there are no tags associated with post
    const newsQuery = `
        SELECT 
            n.*,
            u.id as user_id,
            u.first_name, u.last_name,
            coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags_in_post 
        FROM news n
        left JOIN news_tags nt ON nt.news_id = n.id
        left JOIN tags t ON t.id = nt.tag_id

        INNER JOIN users u ON u.id = n.created_by
        GROUP BY n.id, u.id
        ORDER BY n.display_order;
    `
    const news = await db.query(newsQuery);
    const todays_games = await db.get_todays_games();
    res.status(200).send({ status: 200, data: { news, todays_games }, message: 'Retrieved list of news' })
}


const getNewsById = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const newsByIsQuery = `
        SELECT  
            n.*,
            u.id AS user_id, 
            u.first_name, 
            u.last_name,
            -- jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name)) AS tags_in_post 
            coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags_in_post 
        FROM news n
        LEFT JOIN news_tags nt ON nt.news_id = n.id
        LEFT JOIN tags t ON t.id = nt.tag_id
        INNER JOIN users u ON n.created_by = u.id 
        WHERE n.id = $1 AND deleted_date IS null
        GROUP BY n.id, u.id;
    `;

    const data = await db.query(newsByIsQuery, [id]);
    if (!data) {
        return res.status(200).send({ status: 404, data: [], message: 'News post cannot be found' })
    }
    res.status(200).send({ status: 200, data: data[0], message: 'Retrieved news post' })
}



module.exports = {
    getNews,
    getNewsById
}