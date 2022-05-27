/* eslint-disable no-multi-spaces */
const express = require('express');
const massive = require('massive'); // connects node to db
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// const app = module.exports = express();
const app = express();
module.exports = app;
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method, '=>', req.url);
    next();
});


// controller imports
const news = require('./controllers/news');
const auth = require('./controllers/auth');
const players = require('./controllers/players');
const teams = require('./controllers/teams');
const games = require('./controllers/games');
const locations = require('./controllers/locations');
const seasons = require('./controllers/seasons');
const divisions = require('./controllers/divisions');
const misc = require('./controllers/misc');
const users = require('./controllers/users');
const emailer = require('./controllers/helpers/emailer');
const { isProduction } = require('./controllers/helpers');


// Make sure to create a local postgreSQL db called hockeydb
let connectionInfo;
if (isProduction) {
    const dbUriSplit = process.env.DB_URI.split(/[:/@]+/);
    connectionInfo = {
        user: dbUriSplit[1],
        password: dbUriSplit[2],
        host: dbUriSplit[3],
        port: dbUriSplit[4],
        database: dbUriSplit[5],
        ssl: false,
        poolSize: 2,
    };
} else {
    connectionInfo = process.env.DB_URI;
}
// console.log('IS PRODUCTION', isProduction);
// console.log('CONNECTION INFO', connectionInfo);

massive(connectionInfo, { excludeMatViews: true }).then(instance => {
    // console.log('INSTANCE', instance);
    app.set('db', instance); // add your connection to express
    console.log('Database - connection established');
}).catch(err => console.log('Database - connection failed \n', err));


// ROUTES //

// Seasons
app.get('/api/seasons/', seasons.getSeasons);
app.get('/api/seasons/:id', seasons.getSeasonById);

// Blog
app.get('/api/news', news.getNews);
app.get('/api/news/:id', news.getNewsById);

// Schedule
// app.get('/api/schedule')

// Games
app.get('/api/games', games.getGames);
app.get('/api/games/:id', games.getGameById);

// Teams
app.get('/api/teams/', teams.getAllTeams);
app.get('/api/teams/by-division', teams.getAllTeamsByDivision);
app.get('/api/teams/:id', teams.getTeamById);
app.get('/api/teams/:id/schedule', teams.getTeamSchedule);
// app.get('/api/teams/:id/roster', teams.getTeamSchedule);

// Players
app.get('/api/players', players.getAllPlayers);
app.get('/api/players/:id', players.getPlayerById);

app.get('/api/stats', players.getPlayerStats);


// Standings
app.get('/api/standings', teams.getStandings);

// Leaders
// app.get('/api/leaders')

// Suspensions
// app.get('/api/suspensions')

// About
// app.get('/api/about')

// Locations
app.get('/api/locations', locations.getLocations);

// Divisions
app.get('/api/divisions/', divisions.getAllDivisions);
// app.get('/api/divisions/:season_id', divisions.getAllDivisions);
// app.get('/api/divisions/:season_id', divisions.getDivisionById);

// Misc
app.get('/api/misc/teams-filters', misc.getTeamsPageFilters);
app.get('/api/misc/standings-filters', misc.getStandingsPageFilters);
app.get('/api/misc/news-tags', misc.getNewsTags);


// ADMIN


// const accessPlayer =          ['super', 'admin', 'manager', 'player'];
// const accessManager =         ['super', 'admin', 'manager'];
// const accessScorekeeper =     ['super', 'admin', 'scorekeeper'];
// const accessAdmin = ['super'];

// Create seasons
// app.post('/api/admin/seasons',       auth.authorizeAccessToken2(accessAdmin), admin.createSeason);

app.post('/api/admin/seasons', auth.authorizeAccessToken, seasons.createSeason);
app.put('/api/admin/seasons/:id', auth.authorizeAccessToken, seasons.updateSeason);
app.delete('/api/admin/seasons/:id', auth.authorizeAccessToken, seasons.deleteSeason);

// Create division
app.post('/api/admin/divisions', auth.authorizeAccessToken, divisions.createDivision);
app.put('/api/admin/divisions/:id', auth.authorizeAccessToken, divisions.updateDivision);
app.delete('/api/admin/divisions/:id', auth.authorizeAccessToken, divisions.deleteDivision);

// Create location
app.post('/api/admin/locations', auth.authorizeAccessToken, locations.createLocation);
app.put('/api/admin/locations/:id', auth.authorizeAccessToken, locations.updateLocation);
app.delete('/api/admin/locations/:id', auth.authorizeAccessToken, locations.deleteLocation);

// Create team
app.post('/api/admin/teams', auth.authorizeAccessToken, teams.createTeam);
app.put('/api/admin/teams/:id', auth.authorizeAccessToken, teams.updateTeam);
app.delete('/api/admin/teams/:id', auth.authorizeAccessToken, teams.deleteTeam);

// Create player
app.post('/api/admin/players', auth.authorizeAccessToken, players.createPlayer);
app.put('/api/admin/players/:id', auth.authorizeAccessToken, players.updatePlayer);
app.delete('/api/admin/players/:id', auth.authorizeAccessToken, players.deletePlayer);

// Create news post
app.post('/api/admin/news', auth.authorizeAccessToken, news.createNews);
app.put('/api/admin/news/:id', auth.authorizeAccessToken, news.updateNews);
app.delete('/api/admin/news/:id', auth.authorizeAccessToken, news.deleteNews);

// Update about
app.post('/api/admin/about');

// Create game

app.post('/api/admin/games', auth.authorizeAccessToken, games.createGame);
// app.put('/api/admin/games/:id')

app.get('/api/admin/users', users.getUsers);

// email test
app.get('/api/admin/emailer', emailer.newUserEmail);

// AUTH //

// Log in
app.post('/api/auth/login', auth.login);

// Sign up
app.post('/api/auth/signup', auth.signup);

// Reset password
app.post('/api/auth/password/reset', auth.sendResetPassword);
app.put('/api/auth/password/reset/:token', auth.updatePassword);

// Invite user
app.post('/api/auth/invite', auth.invite);
app.post('/api/auth/invite/register', auth.registerFromInvite);
app.put('/api/auth/invite/:id', auth.resendInvite);

// Log out (current logout is not logging out on server side, just client side)
app.post('/api/auth/:id/logout');

// Get logged in user
app.get('/api/auth');

// Create new user
app.post('/api/auth');

// Edit user
app.put('/api/auth/:id');

// Login from cookie
app.post('/api/auth/login/cookie', auth.loginFromCookie);

// Used for production
if (isProduction) {
    console.log('running in herooku');
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// 404
app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Route not found' });
});

// Error handler

// to use, throw an object in the controller and pass the error to next(err) in the catch
// throw {status: 404, message: 'Seasons received an error', notification_type: 'snack'}
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const date = new Date();
    const errorObject = {
        status: err.status || 500,
        message: err.message ? err.message : err,
        error: true,
        notification_type: err.notification_type || 'modal',
        date,
    };
    console.log('\x1B[0;31m ------------------------- ERROR ------------------------- \x1B[0m');
    console.log('The error occurend on', date.toString());
    console.log(errorObject);
    console.log('\x1B[0;31m ----------------------- END ERROR -----------------------\x1B[0m');
    res.status(errorObject.status).json(errorObject);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
