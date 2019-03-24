
const app = require('../server.js');

const getAllPlayers = async (req, res) => {
  const db = app.get('db');
  // const data = await db.players.find().catch(err => console.log(err));
  const data = await db.query('SELECT * FROM players JOIN player_stats ON players.id = player_stats.player_id JOIN teams on player_stats.team_id = teams.id').catch(err => console.log(err));
  console.log(data, ' ❎');
  // JOIN player_stats ON players.id = player_stats.player_id 

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