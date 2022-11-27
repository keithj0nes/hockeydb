# hockeydb

<!-- CMD + Shift + V to view markdown file in VS code -->

## Running development - BETA

We use Docker for local development. Docker allows us to have a consistent environment while ensuring scalability and flexibility. Install Docker by [Getting Started.](https://docs.docker.com/get-docker/)

To execute any node command in docker, you must run `docker exec $CONTAINER_NAME $NODE_COMMAND` - see [Seed Database](#seed-database) for example 

To start the docker container:

* From the root folder, run&nbsp;&nbsp; `docker compose build`
* After building, run &nbsp;&nbsp;`docker compose up -d`

 OPTIONAL - Use `-d` to detach the docker compose command from the command line. You can then watch the containers via the Docker App. This is useful when needing to run node commands while docker is running. 

To stop the docker container:

* Run&nbsp;&nbsp; `docker compose down`

### Seed Database

TBD: Custom seeding attributes

While docker is running, run&nbsp;&nbsp; `docker exec backend_api npm run seed`


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

        # Development database connection
        DEV_DB_HOST=postgres
        DEV_DB_PORT=5432
        DEV_DB_DATABASE=hockeydb
        DEV_DB_USERNAME=postgres
        DEV_DB_PASSWORD=

- cd /client and create a `.env` file that looks like:

        # REACT_APP_TESTING_PASSWORD must match TESTING_PASSWORD in backend .env file
        REACT_APP_TESTING_PASSWORD=abc123123


### Admin
- If seeding the database is succesfful, login credentials are:
        
        email: super@hockeydb.com
        email: admin@hockeydb.com
        email: scorekeeper@hockeydb.com
        email: teammanager@hockeydb.com
        email: multiaccounts@hockeydb.com

        password: {{ process.env.REACT_APP_TESTING_PASSWORD }}


## Advanced Options

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


### Basic Commands (backend)

*reminder these must be used with `docker exec backend_api $NODE_COMMAND`*

    npm start                   // start server using dev database
    npm run use:dev             // start server using dev database
    npm run use:test            // start server using test database
    npm run migrate             // run new migrations
    npm run migrate create ${fileName} // create new migration
    npm run seed                // seed default database
    npm run migrate seed        // seed default database
    npm run seed test           // seed test database
    npm run migrate seed test   // seed test database

\
&nbsp;

## Use Without Docker - DEPRECATED
Refer to the [deprecated README](https://github.com/keithj0nes/hockeydb)
