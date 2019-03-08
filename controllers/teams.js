const app = require('../server.js');

const getAllTeams = async (req, res) => {
  const db = app.get('db');
  const data = await db.teams.find().catch(err => console.log(err));
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