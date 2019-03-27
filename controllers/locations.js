const app = require('../server.js');

const getLocations = async (req, res) => {
  const db = app.get('db');
  const data = await db.query('select locations.id, locations.name, locations.address from locations');
  res.status(200).send({ status: 200, data, message: 'Retrieved list of locations' })
}


module.exports = {
  getLocations,
}