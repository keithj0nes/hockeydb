# hockeydb

<!-- CMD + Shift + V to view markdown file in VS code -->

### Install Dependencies
- From the project's root level, run &nbsp; `npm install`
- cd /backend, run &nbsp; `npm install`
- cd /client, run &nbsp; `npm install`


### Create .env Files
- cd /backend and create a `.env` file that looks like:

        # PORT is defined for local development only
        PORT=8010
        JWT_SECRET=any_secret_key_that_you_want
        DB_URI=postgres://YOURUSERNAME:YOURPASSWORD@localhost/hockeydb
        SITE_URL=http://localhost:3000
        API_VERSION=0.0.1
        SENDGRID_API_KEY={{ ASK FOR API KEY }}
        TEST_EMAIL={{ YOUR EMAIL FOR DEVELOPMENT TESTING }}
        # TESTING_PASSWORD must match in both backend and client .env files
        TESTING_PASSWORD=abc123123

- cd /client and create a `.env` file that looks like:

        # TESTING_PASSWORD must match in both backend and client .env files
        REACT_APP_TESTING_PASSWORD=abc123123

### Seed Database
- Make sure PostgreSQL is installed on your computer https://www.postgresql.org
- Create a database called &nbsp; `hockeydb`
- From the project's root level, run &nbsp; `npm run seed`
- If any errors occur, rerun the seed command
- You can input your own counts for teams, players, and games by editing the variables in the seed file:
        
        const counts = {
            teams:   { min: 4,  max: 10, exact: null },
            players: { min: 12, max: 16, exact: 5 },
            games:   { min: 5,  max: 8,  exact: null },  
        }

### Launch
- From the project's root level, cd /backend and run &nbsp; `npm start` (this launches nodemon on the server side)
- In a new terminal cd /client and run &nbsp; `npm start`

### Admin
- If you seeded the database correctly, login credentials are:
        
        email: super@hockeydb.com
        email: admin@hockeydb.com
        email: scorekeeper@hockeydb.com
        email: teammanager@hockeydb.com
        email: mutliaccounts@hockeydb.com

        password: {{ TESTING_PASSWORD }}
