const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');

const app = express();
const port = process.env.PORT || 8010;



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Make sure to create a local postgreSQL db called hockeydb

const connectionInfo = "postgres://postgres:@localhost/hockeydb";
let db = null;
massive(connectionInfo, {excludeMatViews: true}).then(instance => {
  app.set('db', instance); // add your connection to express
  db = app.get('db'); // declare a db object for requests
}).catch(err => {
  console.log(err, 'massive err');
});



// ROUTES //

// Blog
app.get('/api/blog')

// Schedule
app.get('/api/schedule')

// Games
app.get('/api/scoresheets/:id')

// Teams
app.get('/api/teams/')
app.get('/api/teams/:id')

// Players
app.get('/api/players/:id')

// Standings 
app.get('/api/standings')

// Leaders 
app.get('/api/leaders')

// Suspensions
app.get('/api/suspensions')

// About
app.get('/api/about')


// ADMIN //

// Create seasons
app.post('/api/seasons')
app.put('/api/seasons/:id')

// Create division
app.post('/api/divisions')
app.put('/api/divisions/:id')

// Create team
app.post('/api/teams')
app.put('/api/teams/:id')

// Create player
app.post('/api/players')
app.put('/api/players/:id')

// Update blog (post new blog)
app.post('/api/blog')
app.put('/api/blog/:id')

// Update about 
app.post('/api/about')


// AUTH //

// Log in
app.post('/api/auth/login', async (req, res) => {
    console.log('============================')

    const { email, password, password_confirmation } = req.body;

    if(password !== password_confirmation) {
        return res.status(400).send({error: 400, message: 'Passwords must match'})
    }
    
    const user = await db.users.findOne({email}).catch(err => console.log(err, 'errorrrrr'));
    // console.log(user, 'data!')
   
    if(!user){
        return res.status(400).send({error: 400, message: 'Incorrect email or password'})
    }

    const pass = await db.passwords.findOne({user_id: user.id});
    // console.log(pass, 'pass!')

    if(pass.pw !== password){
        return res.status(400).send({error: 400, message: 'Incorrect email or password'})
    }


    return res.status(200).send(user)
    


})

// Log out
app.post('/api/auth/:id/logout')

// Get logged in user
app.get('/api/auth')

// Create new user
app.post('/api/auth');

// Edit user
app.put('/api/auth/:id')





app.get('/api/start', (req, res) => {
    console.log('getting here')
    
    db.query('select * from admins').then(users => {
        console.log(users, 'res!')

        res.send({message: 'Getting users from the postgres DB.', users });

    })
});

app.put('/api/admins', (req, res) => {
    console.log(req.body)
    db.admins.update({id: 8}, {email: 'email@test.com'}).then(user => console.log(user, 'edited user!'))
})

app.delete('/api/admins', (req, res) => {
    db.admins.destroy({id: 12}).then(user => console.log(user, 'deleted user'))
})

app.post('/api/admins', (req, res) => {
    // db.query('')

    console.log(req.body)
    // db.admins.findOne({email: req.body.email}).then(user => {
        // if(user){
        //     res.send({message: 'User already exisits', error: true});
        //     return console.log('user already exisists')
        // }

        db.admins.insert(req.body).then(user => {
            res.send({message: 'New user added!.', user });
        })
    // })


})


app.listen(port, () => console.log(`Server running on port ${port}`))