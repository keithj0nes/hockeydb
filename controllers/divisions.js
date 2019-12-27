const app = require('../server.js');

const getAllDivisions = async (req, res) => {
  const db = app.get('db');
  const { season_id } = req.params;
  // const season_id = 2;
  const data = await db.divisions.find({season_id}).catch(err => console.log(err));
  res.status(200).send({ status: 200, data, message: 'Retrieved list of Divisions' })
}


const getDivisionById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const data = await db.divisions.findOne({ id }).catch(err => console.log(err));
  if (!data) {
    return res.status(404).send({ status: 404, data: [], message: 'Division cannot be found' })
  }
  res.status(200).send({ status: 200, data, message: 'Retrieved Division' })
}

module.exports = {
  getAllDivisions,
  getDivisionById
}