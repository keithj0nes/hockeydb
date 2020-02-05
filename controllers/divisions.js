const app = require('../server.js');

const getAllDivisions = async (req, res) => {
  const db = app.get('db');
  
  const { season_id } = req.params;
  // const season_id = 2;
  const data = await db.divisions.find({season_id}).catch(err => console.log(err));


  const seasons = await db.seasons.find({'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));
  


  res.status(200).send({ status: 200, data: {divisions: data, seasons}, message: 'Retrieved list of Divisions' });

  // res.status(200).send({ status: 200, data, message: 'Retrieved list of Divisions' });
}


// const filter = (query) => {
//   const q = {...query};
//   if(q.show_hidden){
//       delete q.show_hidden;
//       q['hidden_date !='] = null;
//   } else {
//       q['hidden_date ='] = null;
//   }
//   q["deleted_date ="] = null;
//   return q;
// }


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