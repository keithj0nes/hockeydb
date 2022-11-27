# hockeydb

<!-- CMD + Shift + V to view markdown file in VS code -->

### Install Dependencies
- From the project's root level, run &nbsp; `npm install`
- cd /backend, run &nbsp; `npm install`
- cd /client, run &nbsp; `npm install`


### Create .env Files
- cd /backend and create a &nbsp;`.env`&nbsp; file that looks like:

        # PORT is defined for local development only
        PORT=8010

        # TESTING_PASSWORD must match REACT_APP_TESTING_PASSWORD in frontend .env file
        TESTING_PASSWORD=abc123123

        JWT_SECRET=any_secret_key_that_you_want
        SITE_URL=http://localhost:3000
        API_VERSION=0.0.1
        SENDGRID_API_KEY={{ ASK FOR API KEY }}
        TEST_EMAIL={{ YOUR EMAIL FOR DEVELOPMENT TESTING }}

        # Test database connection
        TEST_DB_HOST=localhost
        TEST_DB_PORT=5432
        TEST_DB_DATABASE=hockeydb-test
        TEST_DB_USERNAME=YOURUSERNAME
        TEST_DB_PASSWORD=YOURPASSWORD

        # Development database connection
        DEV_DB_HOST=localhost
        DEV_DB_PORT=5432
        DEV_DB_DATABASE=hockeydb
        DEV_DB_USERNAME=YOURUSERNAME
        DEV_DB_PASSWORD=YOURPASSWORD

- cd /client and create a `.env` file that looks like:

        # REACT_APP_TESTING_PASSWORD must match TESTING_PASSWORD in backend .env file
        REACT_APP_TESTING_PASSWORD=abc123123

### Seed Database OLD
- Make sure PostgreSQL is installed on your computer https://www.postgresql.org
- Create a database called &nbsp; `hockeydb`
- From the project's root level, cd /backend and run &nbsp; `npm run seed  [optional: test | dev (default)]` &nbsp; OR &nbsp; `npm run migrate seed  [optional: test | dev (default)]`
- If any errors occur, rerun the seed command
- You can input your own counts for teams, players, and games by editing the variables in the &nbsp;`seedMigration.js`&nbsp; file:
        
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
        email: multiaccounts@hockeydb.com

        password: {{ process.env.REACT_APP_TESTING_PASSWORD }}


### Database Migrations
When making updates to the database, a migration can be added to update the database incrementally, such as needing to add new tables, add columns to tables, etc

#### Running a migration

`npm run migrate [optional: test | prod | dev (default)]`

#### Creating a migration

`npm run migrate create ${fileName}`

- Creating a new migration will create a new blank `.sql` file.
- `${fileName}` should be snake case `like_this_example`

### Use Test Database
By default, starting the server will use the `hockeydb` database. If you've created a `hockeydb-test` database, you can run `npm run use:test` to use the test database instead of the default.


## Basic Commands (backend)

    npm start                   // start server using dev database
    npm run use:dev             // start server using dev database
    npm run use:test            // start server using test database
    npm run migrate             // run new migrations
    npm run migrate create ${fileName} // create new migration
    npm run seed                // seed default database
    npm run migrate seed        // seed default database
    npm run seed test           // seed test database
    npm run migrate seed test   // seed test database
