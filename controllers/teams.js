const app = require('../server.js');

const getAllTeams = async (req, res) => {
  const db = app.get('db');

  console.log(req.session, 'req.user')
  console.log(req.query, 'getting teams!')
  let { division_id, division, season } = req.query;
  // console.log(division_id, 'divid')
  

  const season_id = await db.seasons.findOne({name: season, 'deleted_date =': null}).catch(err => console.log(err, 'ERROR!!!'))
  const divisions = await db.divisions.find({season_id: season_id.id,}).catch(err => console.log(err, 'error in getTeams divisions'));
  const seasons = await db.seasons.find({'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));

  const query = `
    SELECT teams.*, seasons.name AS season_name, divisions.name AS division_name, divisions.id AS division_id FROM team_season_division tsd 
    JOIN teams ON teams.id = tsd.team_id
    JOIN seasons ON seasons.id = tsd.season_id
    JOIN divisions ON divisions.id = tsd.division_id
    WHERE tsd.season_id = ${season_id.id} AND ${!!division ? 'divisions.name = $1': 'tsd.division_id is not null'};
  `;
  const data = await db.query(query, [division]);
  res.status(200).send({ status: 200, data: {teams: data, divisions, seasons}, message: 'Retrieved list of teams' });
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