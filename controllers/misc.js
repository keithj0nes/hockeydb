
const app = require('../server.js');

const getTeamsPageFilters = async (req, res) => {
    const db = app.get('db');

    // get seasons
    // get all teams


    const { season } = req.query;

    let season_id;
  
    if(!season || season === 'undefined'){
      season_id = await db.seasons.findOne({is_active: true});
    }

    const allTeamsQuery = `
        SELECT t.id, t.name FROM team_season_division tsd
        JOIN teams t ON t.id = tsd.team_id
        WHERE tsd.season_id = $1;
    `;
    
    const all_teams = await db.query(allTeamsQuery, [season || season_id.id]);
    
    
    const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_date IS null AND hidden_date IS null ORDER BY id;');


    res.status(200).send({ status: 200, data: {seasons, all_teams}, message: 'Retrieved list of teams page filters' })

}


module.exports = {
    getTeamsPageFilters
}