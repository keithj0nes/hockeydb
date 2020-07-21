# hockeydb

<!-- CMD + Shift + V to view markdown file in VS code -->

### Install Dependencies
+ From the project's root level, run &nbsp; `npm install`
+ Note: You may need to cd /client and run &nbsp; `npm install` &nbsp; as well

### Create Config Files
+ From the project's root level, create a &nbsp; `config.js` &nbsp; file that looks like:

        module.exports = {
            PORT: 8010,   // must match client_config.js ROOT key below 
            JWTSECRET: 'some_secret_key_that_you_want',
            DB_URI: 'postgres://YOURUSERNAME:YOURPASSWORD@localhost/hockeydb',
            SITE_URL: 'localhost', // any fake url
            API_VERSION: '0.0.1'   // any fake version
        }

+ cd /client/src, create a &nbsp; `client_config.js` &nbsp; file that looks like: 

        const tierLevels = {
            ROOKIE:  'ROOKIE',
            AMATEUR: 'AMATEUR',
            PRO:     'PRO'
        }

        // const SITE_LEVEL = tierLevels.ROOKIE;
        // const SITE_LEVEL = tierLevels.AMATEUR;
        const SITE_LEVEL = tierLevels.PRO;

        module.exports = {
            ROOT: 'http://localhost:8010',   // must match config.js PORT key above 
            SITE_LEVEL
        }

### Seed Database
+ Make sure PostgreSQL is installed on your computer https://www.postgresql.org/
+ Create a database called &nbsp; `hockeydb`
+ From the project's root level, run &nbsp; `npm run seed`
+ If any errors occur, rerun the seed command
+ You can input your own counts for teams, players, and games by editing the variables in the seed file:
        
        const counts = {
                teams:   { min: 4,  max: 10, exact: null },
                players: { min: 12, max: 16, exact: 5 },
                games:   { min: 5,  max: 8,  exact: null },  
        }

### Launch
+ From the project's root level, run &nbsp; `npm start` (this launches nodemon on the server side)
+ In a new terminal cd /client and run &nbsp; `npm start`

### Admin
+ If you seeded the database correctly, login credentials are:
        
        email: admin@hockeydb.com
        password: admin

        email: scorekeeper@hockeydb.com
        password: scorekeeper

        email: teammanager@hockeydb.com
        password: manager