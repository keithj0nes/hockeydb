# hockeydb


### Install Dependencies
+ From the project's root level, run &nbsp; `npm install`
+ Note: You may need to cd /client and run &nbsp; `npm install` &nbsp; as well

### Create Config Files
+ From the project's root level, create a &nbsp; `config.js` &nbsp; file that looks like:

        module.exports = {
            PORT: 8010,   // must match client_config.js ROOT key below 
            JWTSECRET: 'some_secret_key_that_you_want',
            DB_URI: 'postgres://YOURUSERNAME:YOURPASSWORD@localhost/hockeydb'
        }

+ cd /client/src, create a &nbsp; `client_config.js` &nbsp; file that looks like: 

        module.exports = {
            ROOT: 'http://localhost:8010'   // must match config.js PORT key above 
        }

### Seed Database
+ Make sure PostgreSQL is installed on your computer https://www.postgresql.org/
+ Create a database called &nbsp; `hockeydb`
+ From the project's root level, run &nbsp; `npm run seed`

### Launch
+ From the project's root level, run &nbsp; `npm start` (this launches nodemon on the server side)
+ In a new terminal cd /client and run &nbsp; `npm start`

### Admin
+ If you seeded the database correctly, login credentials are:
        
        email: admin@hockeydb.com
        password: admin