const app = require('../server.js');

const getLocations = async (req, res) => {
  const db = app.get('db');
  const data = await db.query('SELECT * FROM locations WHERE deleted_date IS NULL ORDER BY UPPER(name)');
  res.status(200).send({ status: 200, data, message: 'Retrieved list of locations' })
}


module.exports = {
  getLocations,
}