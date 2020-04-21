const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const cors = require('cors');
const config = require('./config');


// const jwt = require('jsonwebtoken');
// require('dotenv').config();

const app = module.exports = express();
const port = process.env.PORT || config.PORT;

// const version = 'v1';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const admin = require('./controllers/admin');
const news = require('./controllers/news');
const auth = require('./controllers/auth');
const players = require('./controllers/players');
const teams = require('./controllers/teams');
const games = require('./controllers/games');
const locations = require('./controllers/locations');
const seasons = require('./controllers/seasons');
const divisions = require('./controllers/divisions');


//Make sure to create a local postgreSQL db called hockeydb

// const connectionInfo = process.env.DATA_BASE_URL || "postgres://@localhost/hockeydb";
const connectionInfo = config.DB_URI

let db = null;
massive(connectionInfo, { excludeMatViews: true }).then(instance => {
    app.set('db', instance); // add your connection to express
    db = app.get('db'); // declare a db object for requests
}).catch(err => {
    console.log(err, 'massive err');
});


/*
    current data return implimentation
*/

// return errors -  
// {
//     status: number,
//     error: boolean,
//     message: string
// }

// return res.status(400).send({status: 400, error: true, message: 'Passwords must match'})

// return success - 
// {
//     status: number,
//     data: array/object,
//     message: string
// }

// return res.status(200).send({status: 200, data: user, message: 'You have successfully logged in'})



/*
    possible data ruturn implimentation
*/

// function sendFormat({status, code, message, data}) {
//     const date = new Date();
//     return {
//         "site": config.SITE_URL,
//         "version": config.API_VERSION,
//         "datetime": date,
//         "timestamp": date.getTime(),
//         "status": status,
//         "code": code,
//         "message": message,
//         "data": data
//     }
// }

// {
//     "site": "hockeydb.com",
//     "version": "1.2.3",
//     "datetime": "2016-10-06T19:58:29Z",
//     "timestamp": 1475783909566791977,
//     "status": "success",
//     "code": 200,
//     "message": "OK",
//     "data": {
//         "routes": [
//             {
//                 "method": "GET",
//                 "path": "/status",
//                 "description": "check this service status"
//             },
//             {
//                 "method": "GET",
//                 "path": "/password",
//                 "description": "returns a random passwords"
//             }
//         ]
//     }
// }

// Examples
// If the email field is missing, return a 400 .
// If the password field is too short, return a 422 .
// If the email field isn’t a valid email, return a 422 .
// If the email is already taken, return a 409 .


// ROUTES //

// Seasons
app.get(`/api/seasons/`, seasons.getSeasons);                   // Postman Docs
app.get(`/api/seasons/:id`, seasons.getSeasonById);

// Blog
app.get(`/api/news`, news.getNews);
app.get(`/api/news/:id`, news.getNewsById)

// Schedule
// app.get(`/api/schedule`)

// Games
app.get(`/api/games`, games.getGames);
// app.get(`/api/games/:id`, games.getGamesById);

// Teams
app.get(`/api/teams/`, teams.getAllTeams);
app.get(`/api/teams/:id`, teams.getTeamById);

// Players
app.get(`/api/players`, players.getAllPlayers);
app.get(`/api/players/:id`, players.getPlayerById);


// Standings 
// app.get(`/api/standings`)

// Leaders 
// app.get(`/api/leaders`)

// Suspensions
// app.get(`/api/suspensions`)

// About
// app.get(`/api/about`)

// Locations
app.get(`/api/locations`, locations.getLocations)

// Divisions
app.get(`/api/divisions/`, divisions.getAllDivisions);          // Postman Docs
// app.get(`/api/divisions/:season_id`, divisions.getAllDivisions);
// app.get(`/api/divisions/:season_id`, divisions.getDivisionById);


// ⭐ ️ ADMIN  ⭐️

// Create seasons
app.post(`/api/admin/seasons`, auth.authorizeAccessToken, admin.createSeason);             // Postman Docs
app.put(`/api/admin/seasons/:id`, auth.authorizeAccessToken, admin.updateSeason);          // Postman Docs
app.delete(`/api/admin/seasons/:id`, auth.authorizeAccessToken, admin.deleteSeason);       // Postman Docs

// Create division
app.post(`/api/admin/divisions`, auth.authorizeAccessToken, admin.createDivision);         // Postman Docs
app.put(`/api/admin/divisions/:id`, auth.authorizeAccessToken, admin.updateDivision);
app.delete(`/api/admin/divisions/:id`, auth.authorizeAccessToken, admin.deleteDivision);

// Create location
app.post(`/api/admin/locations`, auth.authorizeAccessToken, admin.createLocation);
app.put(`/api/admin/locations/:id`, auth.authorizeAccessToken, admin.updateLocation);
app.delete(`/api/admin/locations/:id`, auth.authorizeAccessToken, admin.deleteLocation);

// Create team
app.post(`/api/admin/teams`, auth.authorizeAccessToken, admin.createTeam);
app.put(`/api/admin/teams/:id`, auth.authorizeAccessToken, admin.updateTeam);
app.delete(`/api/admin/teams/:id`, auth.authorizeAccessToken, admin.deleteTeam);

// Create player
app.post(`/api/admin/players`, auth.authorizeAccessToken, admin.createPlayer);
app.put(`/api/admin/players/:id`, auth.authorizeAccessToken, admin.updatePlayer)
app.delete(`/api/admin/players/:id`, auth.authorizeAccessToken, admin.deletePlayer)

// Create blog post
// auth.authorizeAccessToken, -- middleware for authorizing admin blog post
// auth.authorizaccestoken timing out after short period of time
// app.post(`/api/admin/news`, auth.authorizeAccessToken, admin.createNews)
app.post(`/api/admin/news`, auth.authorizeAccessToken, admin.createNews)
app.put(`/api/admin/news/:id`, auth.authorizeAccessToken, admin.updateNews)
app.delete(`/api/admin/news/:id`, auth.authorizeAccessToken, admin.deleteNews)

// Update about 
app.post(`/api/admin/about`)

// Create game

app.post('/api/admin/games', async (req, res) => {

    const { home_team, away_team, location_id, start_date } = req.body;
    return res.status(200).send({ status: 400, data: [], message: 'Create game route not finished in the backend'})

    // const game = await db.games.insert({ home_team, away_team, location_id, start_date, has_been_played: false });

    // return res.status(200).send({ status: 200, data: game, message: 'Game created.' })

})

// app.put('/api/admin/games/:id', async)









// AUTH //

// Log in
app.post(`/api/auth/login`, auth.login)
// Sign up
app.post('/api/auth/signup', auth.signup)

// Invite user
// THESE ROUTES NEED:
//  - NODEMAILER
//  - ROUTE FOR USER TO ENTER PASSWORD AFTER CLICKING EMAIL LINK
app.post('/api/auth/invite', auth.invite)
app.put('/api/auth/invite/:id', auth.reinvite)

// Log out
app.post(`/api/auth/:id/logout`)

// Get logged in user
app.get(`/api/auth`)

// Create new user
app.post(`/api/auth`);

// Edit user
app.put(`/api/auth/:id`)


// secure route

app.get('/topsecretroute', auth.authorizeAccessToken, (req, res, next) => {

    return res.status(200).send({
        status: 200,
        data: {
            user: req.user,
            access_token: req.headers.authorization.split(' ')[1]
        },
        message: 'We reached the top secret route'
    })
})


app.post('/api/auth/login/cookie', auth.loginFromCookie)


app.listen(port, () => console.log(`Server running on port ${port}`))
