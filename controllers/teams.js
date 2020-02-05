const app = require('../server.js');

const getAllTeams = async (req, res) => {
  const db = app.get('db');

  // console.log(req.query, 'getting teams!')
  let { division_id, division } = req.query;
  // console.log(division_id, 'divid')
  
  // This needs to get cleaned up - but template literals wont work for division.name
  let data;

  if(!!division){
    data = await db.query(`
      SELECT teams.*, divisions.name AS division_name 
      FROM teams 
      JOIN divisions 
      ON teams.division_id = divisions.id 
      WHERE divisions.name = $1;
  
    `, [division]).catch(err => console.log(err));
  } else {
    data = await db.query(`
      SELECT teams.*, divisions.name AS division_name 
      FROM teams 
      JOIN divisions 
      ON teams.division_id = divisions.id 
      WHERE divisions.name IS NOT NULL;
  
    `).catch(err => console.log(err));
  }
    // WHERE division_id ${division_id ? '=' + division_id : 'IS NOT NULL'};
  
  res.status(200).send({ status: 200, data, message: 'Retrieved list of teams' })
}


const getTeamById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const data = await db.teams.findOne({ id }).catch(err => console.log(err));
  if (!data) {
    return res.status(404).send({ status: 404, data: [], message: 'Team cannot be found' })
  }
  res.status(200).send({ status: 200, data, message: 'Retrieved Team' })
}

module.exports = {
  getAllTeams,
  getTeamById
}


//need to upgrade to massive@next to 6.0 for joins to work
  // const teamsWithDivisions = await db.teams.join({
  //   divisions: {
  //     type: 'INNER',
  //     on: {division_id: 'id'}
  //   }
  // }).find({
  //   // state: 'EV',
  //   // 'books.author ILIKE': 'calvino, %'
  // });
  
  // console.log(teamsWithDivisions, 'aye')