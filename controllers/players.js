
const app = require('../server.js');

const getAllPlayers = async (req, res) => {
  const db = app.get('db');
  const data = await db.players.find().catch(err => console.log(err));
  res.status(200).send({ status: 200, data, message: 'Retrieved list of players' })
}


const getPlayerById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const data = await db.players.findOne({ id }).catch(err => console.log(err));
  // console.log(data, 'blogs!')
  if (!data) {
    return res.status(404).send({ status: 404, data: [], message: 'Player cannot be found' })
  }
  res.status(200).send({ status: 200, data, message: 'Retrieved Player' })
}

// const getPlayersByTeam = async (req, res) => {
//   const db = app.get('db');
//   const { id } = req.params;
//   const data = await db.players.findOne
// }



module.exports = {
  getAllPlayers,
  getPlayerById
}