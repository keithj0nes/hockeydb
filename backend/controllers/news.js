const dateFormat = require('date-fns/format');
const app = require('../server.js');


const getNews = async (req, res) => {
    const db = app.get('db');
    // coalesce function below will return an empty array of there are no tags associated with post
    const newsQuery = `
        SELECT 
            n.*,
            u.id as user_id,
            u.first_name, u.last_name,
            concat(u.first_name, ' ', u.last_name) as full_name,
            coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags_in_post 
        FROM news n
        LEFT JOIN news_tags nt ON nt.news_id = n.id
        LEFT JOIN tags t ON t.id = nt.tag_id
        INNER JOIN users u ON u.id = n.created_by
        WHERE hidden_date IS ${!!req.query.show_hidden ? 'NOT' : ''} null
        AND deleted_date IS null
        GROUP BY n.id, u.id
        ORDER BY n.display_order;
    `;
    const news = await db.query(newsQuery);
    const todays_games = await db.get_todays_games();
    res.send({ status: 200, data: { news, todays_games }, message: 'Retrieved list of news' });
};


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
        return res.send({ status: 404, data: [], message: 'News post cannot be found' });
    }
    return res.send({ status: 200, data: data[0], message: 'Retrieved news post' });
};


const createNews = async (req, res) => {
    const db = app.get('db');
    const { title, body, tags_in_post } = req.body;

    if (!title || !body) return res.send({ status: 404, error: true, message: 'Title and body are required', notification_type: 'snack' });

    const currentDate = dateFormat(new Date(), 'MM/DD/YYYY hh:mm:ss');
    const updateOrderQuery = `
        UPDATE news 
        SET display_order = (display_order + 1)
        WHERE display_order >= 1;
    `;

    await db.query(updateOrderQuery);
    const inserted = await db.news.insert({ title, display_order: 1, body, created_date: currentDate, created_by: (req.user && req.user.id) || 1 }).catch(err => console.log(err, 'create news error'));

    if (!!tags_in_post.length) {
        const tagsInPost = tags_in_post.map(item => ({ news_id: inserted.id, tag_id: item.id }));
        await db.news_tags.insert(tagsInPost);
    }

    const { id: user_id, first_name, last_name } = req.user;
    const data = { ...inserted, user_id, first_name, last_name };

    return res.send({ status: 200, data, message: 'News post created', notification_type: 'snack' });
};


const updateNews = async (req, res) => {
    const db = app.get('db');

    const { title, body, allow_collapse, tag, fromIndex, toIndex, move, tags_in_post, is_hidden } = req.body;
    const { id } = req.params;

    const newsPost = await db.news.findOne({ id }).catch(err => console.log(err));
    if (!newsPost) {
        return res.send({ status: 404, error: true, message: 'News post not found', notification_type: 'snack' });
    }

    // if updating news post order
    if (!!move) {
        if (move === 'down') {
            const query = `UPDATE news SET display_order = (display_order - 1)
                           WHERE display_order > $1 
                           AND display_order <= $2`;

            const updateDown = await db.query(query, [fromIndex, toIndex]);
            console.log(updateDown, 'UPDATE DOWN!');
        }

        if (move === 'up') {
            const query = `UPDATE news SET display_order = (display_order + 1)
                           WHERE display_order >= $1 
                           AND display_order < $2`;

            const updateUp = await db.query(query, [toIndex, fromIndex]);
            console.log(updateUp, 'UPDATE UP!');
        }
        const updateMove = await db.news.update({ id }, { display_order: toIndex }).catch(err => console.log(err, 'update blog error'));

        return res.send({ status: 200, data: updateMove, message: 'News post order updated' });
    }

    // Manage hidden request
    if (req.body.hasOwnProperty('is_hidden')) {
        const data = await db.news.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden season error'));
        return res.send({ status: 200, data: { ...data[0], is_hidden }, message: is_hidden ? 'News post hidden' : 'News post unhidden', notification_type: 'snack' });
    }

    if (!!tags_in_post.length) {
        await db.news_tags.destroy({ news_id: id });
        const tagsInPost = tags_in_post.map(item => ({ news_id: id, tag_id: item.id }));
        await db.news_tags.insert(tagsInPost);
    }

    const data = await db.news.update({ id }, { title, body, allow_collapse, tag, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update blog error'));
    return res.send({ status: 200, data: data[0], message: 'News post updated', notification_type: 'snack' });
};

const deleteNews = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const newsPost = await db.news.findOne({ id }).catch(err => console.log(err));
    if (!newsPost) {
        return res.send({ status: 404, error: true, message: 'News post not found', notification_type: 'snack' });
    }

    const data = await db.news.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete news post error'));
    return res.send({ status: 200, data: data[0], message: 'News post deleted', notification_type: 'snack' });
};


module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
