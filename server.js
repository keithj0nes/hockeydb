const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');

const config = require('./config');


const jwt = require('jsonwebtoken');




require('dotenv').config();

const app = module.exports = express();
const port = process.env.PORT || config.PORT;

const version = 'v1';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const admin = require('./controllers/admin');
const blogs = require('./controllers/blogs');
const auth = require('./controllers/auth');

//Make sure to create a local postgreSQL db called hockeydb

// const connectionInfo = process.env.DATA_BASE_URL || "postgres://@localhost/hockeydb";
const connectionInfo = "postgres://@localhost/hockeydb";

let db = null;
massive(connectionInfo, { excludeMatViews: true }).then(instance => {
    app.set('db', instance); // add your connection to express
    db = app.get('db'); // declare a db object for requests
}).catch(err => {
    console.log(err, 'massive err');
});

// return errors -  
// {
//     status: number,
//     error: boolean,
//     message: string
// }

// return res.status(400).send({status: 400, error: true, message: 'Passwords must match'})

// return success - 
// {
//     status: number,
//     data: array/object
//     message: string
// }

// return res.status(200).send({status: 200, data: user, message: 'You have successfully logged in'})

// ROUTES //

// Blog
app.get(`/api/blog`, blogs.getBlogs);
app.get(`/api/blog/:id`, blogs.getBlogbyId)

// Schedule
app.get(`/api/schedule`)

// Games
app.get(`/api/scoresheets/:id`)

// Teams
app.get(`/api/teams/`)
app.get(`/api/teams/:id`)

// Players
app.get(`/api/players`)
app.get(`/api/players/:id`)


// Standings 
app.get(`/api/standings`)

// Leaders 
app.get(`/api/leaders`)

// Suspensions
app.get(`/api/suspensions`)

// About
app.get(`/api/about`)


// ⭐ ️ ADMIN  ⭐️

// Create seasons
app.post(`/api/admin/seasons`, admin.createSeason);
app.put(`/api/admin/seasons/:id`, admin.updateSeason);
app.delete(`/api/admin/seasons/:id`, admin.deleteSeason);


// Create division
app.post(`/api/admin/divisions`, admin.createDivision);
app.put(`/api/admin/divisions/:id`, admin.updateDivision);
app.delete(`/api/admin/divisions/:id`, admin.deleteDivision);


// Create team
app.post(`/api/admin/teams`, admin.createTeam);
app.put(`/api/admin/teams/:id`, admin.updateTeam);
app.delete(`/api/admin/teams/:id`, admin.deleteTeam);

// Create player
app.post(`/api/admin/players`, admin.createPlayer);
app.put(`/api/admin/players/:id`, admin.updatePlayer)
app.delete(`/api/admin/players/:id`, admin.deletePlayer)

// Create blog post
app.post(`/api/admin/blog`, auth.authorizeAccessToken, admin.createBlog)
app.put(`/api/admin/blog/:id`, admin.updateBlog)
app.delete(`/api/admin/blog/:id`, admin.deleteBlog)

// Update about 
app.post(`/api/admin/about`)



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





app.listen(port, () => console.log(`Server running on port ${port}`))
