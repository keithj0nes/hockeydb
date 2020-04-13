const massive = require('massive');
const faker = require('faker');
const bcrypt = require('bcrypt');
const prog = require('cli-progress');
const config = require('./config');

const connectionInfo = config.DB_URI || "postgres://@localhost/hockeydb";


massive(connectionInfo, { excludeMatViews: true }).then(async (db) => {

    const randomizer = arr => Math.floor(Math.random() * arr.length);
    
    // hard variables
    const divisionList = ['A', 'B', 'C'];
    const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
    const seasonLength = 10;

    // drop and rebuild schema
    await db.build_schema();

    // create admin
    const newUser = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), is_admin: true, email: 'admin@hockeydb.com'});
    const password = 'admin';
    const hash = await bcrypt.hash(password, 10);
    await db.passwords.insert({ user_id: newUser.id, pw: hash })


    // create seasons
    const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
    const name = ['Summer 2016', 'Fall 2016'];        
    const type = typesOfSeasons[randomizer(typesOfSeasons)];
    const season = await db.seasons.insert({ name: name[0], type, is_active: true, created_date: new Date(), created_by: newUser.id }).catch(err => console.log(err, 'create blog error'))
    await db.seasons.insert({ name: name[1], type, is_active: false, created_date: new Date(), created_by: newUser.id }).catch(err => console.log(err, 'create blog error'))


    // create teams
    
    const createTeam = async (division_id) => {
        const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
        
        const randomPlayersCount = Math.floor(Math.random() * 16) + 12;

        const name = teamList[randomizer(teamList)] + ' ' + teamList[randomizer(teamList)] + 's';
        const colors = `${faker.commerce.color()} / ${faker.commerce.color()}`;

        const team = await db.teams.insert({ name, colors, created_date: new Date(), created_by: newUser.id });
        await db.team_season_division.insert({team_id: team.id, season_id: season.id, division_id});
        // b2.increment();

        for(let i = 0; i <= randomPlayersCount; i++){
            createPlayer(team.id);
        }
    }


    // create players

    const createPlayer = async (team_id) => {

        const first_name = faker.name.firstName();
        const last_name = faker.name.lastName();
        const email = faker.internet.email();

        const createdPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: newUser.id });
        await db.player_stats.insert({ player_id: createdPlayer.id, team_id, season: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 })

        const player_team = await db.players_teams.insert({ player_id: createdPlayer.id, team_id, season_id: season.id})
        // b2.increment();
    }

    // create divisions
    
    for(let div in divisionList){
        
        const randomTeamsCount = Math.floor(Math.random() * 8) + 4;
        const division = await db.divisions.insert({ name: divisionList[div], season_id: season.id, created_date: new Date(), created_by: newUser.id }).catch(err => console.log(err, 'create division error'))
        // b2.increment();
        
        for(let  i = 0; i <= randomTeamsCount; i++){
            createTeam(division.id);
        }
    }


    
    // create locations

    for(location in locationsList){
        
        const name = locationsList[location];
        const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`
        
        await db.locations.insert({ name, address, created_date: new Date(), created_by: newUser.id }).catch(err => console.log(err, 'create location error'))
        // b2.increment();
    }


    // create games

    for(div in divisionList){
    
        let divisionTeams = await db.team_season_division.find({division_id: Number(div)+1});
        
        for(let i = 0; i < seasonLength; i++){

            let home_team = divisionTeams[randomizer(divisionTeams)].team_id;
            let away_team = divisionTeams[randomizer(divisionTeams)].team_id;

            const location_id = randomizer(locationsList) + 1;
            const start_date = faker.date.future();

            // team cannot play itself
            while (home_team === away_team){
                home_team = divisionTeams[randomizer(divisionTeams)].team_id;
                away_team = divisionTeams[randomizer(divisionTeams)].team_id;
            }
            const game = await db.games.insert({ home_team, away_team, location_id, start_date, has_been_played: false });
            await db.game_season_division.insert({ game_id: game.id, season_id: season.id, division_id: Number(div) + 1})
        }
    }

    for(var id = 1; id <= 4; id++) {
        await db.games.update({ id }, { has_been_played: true, home_score: Math.floor(Math.random() * 10), away_score:  Math.floor(Math.random() * 10)});
    }


    console.log('done!')

}).catch(err => {
    console.log(err, 'massive error in npm run seed');
});
