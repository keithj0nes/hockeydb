const app = require('../server.js');
const helpers = require('./helpers');

const getAllDivisions = async (req, res) => {
  const db = app.get('db');
  const { season } = req.query;

  const season_id = await db.seasons.findOne({ name: season, 'deleted_date =': null }).catch(err => console.log(err, 'ERRR'))
  // const query = helpers.filter(req.query, ['season'])

  // const data = await db.divisions.find({ ...query, season_id: season_id.id }, { order: [ {field: 'name', direction: 'asc'}]}).catch(err => console.log(err, 'error'));

  const q = `
    SELECT d.id, d.name, COUNT(tsd.id) as teams_count FROM team_season_division tsd
    LEFT JOIN divisions d ON d.id = tsd.division_id
    WHERE tsd.season_id = $1
    GROUP BY d.id;
  `;
  const data = await db.query(q, [season_id.id]);
  const seasons = await db.seasons.find({ 'hidden_date =': null, 'deleted_date =': null }).catch(err => console.log(err));

  res.status(200).send({ status: 200, data: { divisions: data, seasons }, message: 'Retrieved list of Divisions' });
}

// const getDivisionById = async (req, res) => {
//   const db = app.get('db');
//   const { season_id } = req.params;
//   console.log(season_id, 'id!')
//   const data = await db.divisions.find({ season_id }).catch(err => console.log(err));
//   console.log(data, 'data!')
//   if (!data) {
//     return res.status(200).send({ status: 404, data: [], message: 'Division cannot be found' })
//   }
//   res.status(200).send({ status: 200, data, message: 'Retrieved Division' })
// }

module.exports = {
  getAllDivisions,
  // getDivisionById
}
