const app = require('../server.js');


const filter = (query) => {
  const q = {...query};
  if(q.show_hidden){
      delete q.show_hidden;
      q['hidden_date !='] = null;
  } else {
      q['hidden_date ='] = null;
  }
  q["deleted_date ="] = null;
  return q;
}

// const getAllDivisions = async (req, res) => {
//   const db = app.get('db');
  
//   console.log('yo!')
//   const { season_id, season: name } = req.params;
//   // const season_id = 2;
//   const data = await db.divisions.find(season_id ? {season_id} : { name }).catch(err => console.log(err));

//   console.log(data, 'DATA IN BACKEND')

//   const seasons = await db.seasons.find({'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));
  


//   res.status(200).send({ status: 200, data: {divisions: data, seasons}, message: 'Retrieved list of Divisions' });

//   // res.status(200).send({ status: 200, data, message: 'Retrieved list of Divisions' });
// }


const getAllDivisions = async (req, res) => {
  const db = app.get('db');

  console.log(req.query, 'QUERYRYYY')

  // const query = filter(req.query);

  const season_id = await db.seasons.findOne({name: req.query.season, 'deleted_date =': null})
  console.log(season_id, ' seasonid')

  const data = await db.divisions.find({season_id: season_id.id, 'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));
  // console.log(data,' DATAY IN GETALLDIVISIONS')
  const seasons = await db.seasons.find({'hidden_date =': null, 'deleted_date =': null}).catch(err => console.log(err));
  res.status(200).send({ status: 200, data: {divisions: data, seasons}, message: 'Retrieved list of Divisions' });

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