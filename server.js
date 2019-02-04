const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');

const app = express();
const port = process.env.PORT || 8010;



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const connectionInfo = "postgres://postgres:@localhost/hockeydb";
let db = null;
massive(connectionInfo, {excludeMatViews: true}).then(instance => {
  app.set('db', instance); // add your connection to express
  db = app.get('db'); // declare a db object for requests
}).catch(err => {
  console.log(err, 'massive err');
});


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