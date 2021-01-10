const app = require('../server.js');
const helpers = require('./helpers');

// notificationType = 'snack' | 'modal' | 'none'; maybe ???

const getSeasons = async (req, res) => {
    try {
        const db = app.get('db');
        const query = helpers.filter(req.query);
        console.log(req.query,' req.query!')

        const { limit = 2, page = 1, dir = 'desc' } = req.query;

        const offset = (!page || page <= 1) ? 0 : (page-1) * limit;
        console.log(offset)
        const total_count = await db.seasons.count({ ...query });
        const seasons = await db.seasons.find({
            ...query
        }, {
            order: [{field: 'id', direction: dir }],
            offset,
            limit,
        });
        
        const total_pages = Math.ceil(total_count / limit);
        console.log({total_count: parseInt(total_count), seasons_length: seasons.length, total_pages, page: parseInt(page) })

        return res.status(200).send({ status: 200, data: { seasons, pagination: { total_count: parseInt(total_count), total_pages, page: parseInt(page) } }, message: 'Retrieved list of seasons' })

    } catch (error) {
        console.log(error)
        let errorDetails;        
        switch (error.routine) {
            case 'errorMissingColumn':
                errorDetails = { message: 'Cannot find column', snack: false };
                break;
            default:
                errorDetails = { message: 'An error occured', snack: true };
                break;
        }
        return res.status(200).send({ status: 400, error: true, ...errorDetails })
    }
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



// const getSeasonsFunc = async ({ page, limit, query }) => {
//     const offset = (!page || page <= 1) ? 0 : (page-1) * limit;
//     const total_count = await db.seasons.count({ ...query });
//     const seasons = await db.seasons.find({
//         ...query
//     }, {
//         order: [{field: 'id', direction: dir }],
//         offset,
//         limit,
//     });
//     const total_pages = Math.ceil(total_count / limit);
//     return { total_count, seasons, total_pages, currentPage: parseInt(page) }
// }
// const m = await getSeasonsFunc({ page, limit, query });
// console.log({m})

// const { total_count, seasons, total_pages, currentPage } = m;
// if (seasons.length <= 0 && currentPage > 1) {
//     console.log('hitting')
//     const n = await getSeasonsFunc({ page: 1, limit, query });
//     const { total_count, seasons, total_pages, currentPage } = n;
//     return res.status(200).send({ status: 200, data: { total_count, seasons, total_pages, page: parseInt(currentPage) }, message: 'Retrieved list of seasons' })
// }

// return res.status(200).send({ status: 200, data: { total_count, seasons, total_pages, page: parseInt(page) }, message: 'Retrieved list of seasons' })
      