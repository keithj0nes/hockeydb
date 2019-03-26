const app = require('../server.js');

const getGames = async (req, res) => {
  const db = app.get('db');
  const data = await db.get_games();
  console.log(data, 'GAMES!')
  res.status(200).send({ status: 200, data, message: 'Retrieved list of games' })
}



const getGameById = async (req, res) => {
  const db = app.get('db');
  const { id } = req.params;
  const data = await db.query('select * from games where id = $1', [id]);
  if (!data) {
    return res.status(404).send({ status: 404, data: [], message: 'game cannot be found' })
  }
  res.status(200).send({ status: 200, data, message: 'Retrieved game' })
}


module.exports = {
  getGames,

}