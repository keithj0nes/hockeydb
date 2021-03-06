const massive = require('massive');
const faker = require('faker');
const bcrypt = require('bcrypt');

const connectionInfo = process.env.DB_URI;

massive(connectionInfo, { excludeMatViews: true }).then(async (db) => {
    // helper
    const randomr = (num, max) => {
        if (num && !max) {
            return Math.floor(Math.random() * num); // mainly used for array indexs
        }
        return Math.floor(Math.random() * (max - num + 1)) + num; // used for between min and max
    };

    // hard variables
    const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
    const seedSeasons = ['Summer 2016', 'Fall 2016'];
    const divisionList = [['1A', '2B', '3C'], ['AAA', 'AA', 'A']];
    const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
    const counts = {
        teams: { min: 4, max: 10, exact: null }, // teams per division - exact has priority
        players: { min: 12, max: 16, exact: 5 }, // players per team - exact has priority
        games: { min: 5, max: 8, exact: null }, // games per team - exact has priority
    };
    const admins = [
        // {email: 'owner@hockeydb.com',  admin_type: 'owner'},         // not doing anything with this yet
        { email: 'admin@hockeydb.com', admin_type: 'admin' },
        { email: 'scorekeeper@hockeydb.com', admin_type: 'scorekeeper' }, // not doing anything with this yet
        { email: 'teammanager@hockeydb.com', admin_type: 'manager' }, // not doing anything with this yet
    ];


    // create admins
    const createAdmins = async () => Promise.all(admins.map(async admin => {
        const insertedAdmin = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), admin_type: admin.admin_type, email: admin.email });
        const password = admin.admin_type;
        const hash = await bcrypt.hash(password, 10);
        await db.passwords.insert({ user_id: insertedAdmin.id, pw: hash });

        return insertedAdmin;
    }));


    // create seasons
    const createSeason = async (insertedAdmin) => Promise.all(seedSeasons.map(async (seedSeason, idx) => {
        const type = typesOfSeasons[randomr(typesOfSeasons.length)];
        const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: false, created_date: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create season error'));
        return createDivisions(idx, insertedSeason, insertedAdmin);
    }));


    // create divisions
    const createDivisions = async (idx, insertedSeason, insertedAdmin) => Promise.all(
        divisionList[idx].map(async division => {
            const { exact, min, max } = counts.teams;
            const randomTeamsCount = exact || randomr(min, max);
            const insertedDivision = await db.divisions.insert({ name: division, season_id: insertedSeason.id, created_date: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create division error'));

            const promises = [];
            for (let i = 0; i < randomTeamsCount; i++) {
                promises.push(createTeams(insertedDivision, insertedSeason, insertedAdmin));
            }

            return Promise.all(promises);
        }),
    );


    // create teams
    const createTeams = async (insertedDivision, insertedSeason, insertedAdmin) => {
        const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
        const { exact, min, max } = counts.players;

        const randomPlayersCount = exact || randomr(min, max);

        const name = `${teamList[randomr(teamList.length)]} ${teamList[randomr(teamList.length)]}s`;
        // const colors = `${faker.commerce.color()} / ${faker.commerce.color()}`;
        const colors = colorRandomizer();

        const insertedTeam = await db.teams.insert({ name, colors, created_date: new Date(), created_by: insertedAdmin.id });
        await db.team_season_division.insert({ team_id: insertedTeam.id, season_id: insertedSeason.id, division_id: insertedDivision.id });

        const promises = [];
        for (let i = 0; i < randomPlayersCount; i++) {
            promises.push(createPlayer(insertedTeam, insertedSeason, insertedAdmin));
        }

        return Promise.all(promises);
    };


    // create players
    const createPlayer = async (insertedTeam, insertedSeason, insertedAdmin) => {
        const first_name = faker.name.firstName();
        const last_name = faker.name.lastName();
        const email = faker.internet.email();
        const insertedPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: insertedAdmin.id });
        await db.player_stats.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season_id: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
        await db.players_teams.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season_id: insertedSeason.id });
        return true;
    };


    // create games
    const createGames = async (locations) => {
        let newIndexDiv = 0;

        return Promise.all(
            seedSeasons.map((seedSeason, seasonIndex) => Promise.all(
                divisionList[seasonIndex].map(async (division, divisionIndex) => {
                    newIndexDiv += 1; // get db.division.id without getting into the db | this will cause problems when adding more seasons to seeding
                    const n = newIndexDiv; // this avoids newIndexDiv to ALL be set to 6
                    const { exact, min, max } = counts.games;
                    const seasonGamesLength = exact || randomr(min, max);
                    const divisionTeams = await db.team_season_division.find({ division_id: n, season_id: seasonIndex + 1 });

                    Promise.all(
                        Array(seasonGamesLength).fill().map(async (_, i) => {
                            let home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                            let away_team = divisionTeams[randomr(divisionTeams.length)].team_id;

                            const location_id = randomr(locations.length) + 1;
                            const start_date = faker.date.future();

                            // team cannot play itself
                            while (home_team === away_team) {
                                home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                                away_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                            }

                            const game = await db.games.insert({ home_team, away_team, location_id, start_date, has_been_played: false });
                            await db.game_season_division.insert({ game_id: game.id, season_id: seasonIndex + 1, division_id: n });
                        }),
                    );
                }),
            )),
        );
    };


    // create locations
    const createLocations = async (admin) => Promise.all(locationsList.map(async location => {
        const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
        return await db.locations.insert({ name: location, address, created_date: new Date(), created_by: admin.id }).catch(err => console.log(err, 'create location error'));
    }));


    // update games to played
    const setGamesPlayed = async num => {
        const games = await db.query('select * from games order by start_date limit $1', [num || 5]);

        await db.seasons.update({ id: 1 }, { is_active: true });

        return Promise.all(
            Array(games.length).fill().map(async (_, i) => {
                await db.games.update({ id: games[i].id }, { has_been_played: true, home_score: randomr(0, 8), away_score: randomr(0, 8) });
            }),
        );
    };


    const initiateSeed = async () => {
        console.log('🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\  Initiating Seeding 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟', '\n');
        // drop and rebuild schema
        await db.build_schema();
        console.log('\ \ \ ✅\ \  Schema Rebuilt');
        const createdAdmins = await createAdmins();
        console.log('\ \ \ ✅\ \  Admins Created');
        const allLocations = await createLocations(createdAdmins[0]);
        console.log('\  \ ✅\ \  Locations Created');
        await createSeason(createdAdmins[0]);
        console.log('\ \ \ ✅\ \  Seasons Created');
        await createGames(allLocations);
        console.log('\ \ \ ✅\ \  Games Created');
        await setGamesPlayed(10);
        console.log('\n', '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\  Seeding Finished 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟');
    };

    initiateSeed();
}).catch(err => {
    console.log(err, 'massive error in npm run seed');
});

function colorRandomizer() {
    const colors_list = [
        { id: 1, name: 'Black', color: '#000000' },
        { id: 2, name: 'White', color: '#FFFFFF' },
        { id: 3, name: 'Gunmetal', color: '#2C3539' },
        { id: 4, name: 'Smoke', color: '#726E6D' },
        { id: 5, name: 'Slate Blue', color: '#98AFC7' },
        { id: 6, name: 'Steel', color: '#4863A0' },
        { id: 7, name: 'Navy', color: '#151B54' },
        { id: 8, name: 'Colbalt', color: '#0020C2' },
        { id: 9, name: 'Royal', color: '#2B60DE' },
        { id: 10, name: 'Glacier', color: '#368BC1' },
        { id: 11, name: 'Crystal', color: '#5CB3FF' },
        { id: 12, name: 'Coral Blue', color: '#AFDCEC' },
        { id: 13, name: 'Cyan', color: '#00FFFF' },
        { id: 14, name: 'Sea Green', color: '#438D80' },
        { id: 15, name: 'Teal', color: '#008080' },
        { id: 16, name: 'Forest', color: '#254117' },
        { id: 17, name: 'Jungle Green', color: '#347C2C' },
        { id: 18, name: 'Lime', color: '#41A317' },
        { id: 19, name: 'Apple Green', color: '#4CC417' },
        { id: 20, name: 'Mint', color: '#98FF98' },
        { id: 21, name: 'Yellow', color: '#FFFF00' },
        { id: 22, name: 'Cream', color: '#FFFFCC' },
        { id: 23, name: 'Champagne', color: '#F7E7CE' },
        { id: 24, name: 'Peach', color: '#FFE5B4' },
        { id: 25, name: 'Athletic Gold', color: '#FDD017' },
        { id: 26, name: 'Bronze', color: '#CD7F32' },
        { id: 27, name: 'Copper', color: '#B87333' },
        { id: 28, name: 'Pumpkin', color: '#F87217' },
        { id: 29, name: 'Salmon', color: '#F9966B' },
        { id: 30, name: 'Red', color: '#FF0000' },
        { id: 31, name: 'Deep Red', color: '#E41B17' },
        { id: 32, name: 'Cranberry', color: '#9F000F' },
        { id: 33, name: 'Maroon', color: '#810541' },
        { id: 34, name: 'Pink', color: '#FAAFBE' },
        { id: 35, name: 'Hot Pink', color: '#F52887' },
        { id: 36, name: 'Purple', color: '#571B7E' },
        { id: 37, name: 'Violet', color: '#8D38C9' },
    ];
    const res = [];
    for (let i = 0; i < 2;) {
        const random = Math.floor(Math.random() * colors_list.length);
        if (res.indexOf(colors_list[random]) !== -1) {
            continue;
        }
        res.push(colors_list[random]);
        i++;
    }
    return JSON.stringify(res);
}


// FOR ELEPHANT SQL!!!!

// const massive = require('massive');
// const faker = require('faker');
// const bcrypt = require('bcrypt');
// // const prog = require('cli-progress');
// const config = require('./config');

// const connectionInfo = config.DB_URI;
// massive(connectionInfo, { excludeMatViews: true, poolSize: 100 }).then(async (db) => {
//     // helper
//     const randomr = (num, max) => {
//         if(num && !max) {
//             return Math.floor(Math.random() * num)  // mainly used for array indexs
//         } else {
//             return Math.floor(Math.random() * (max - num + 1)) + num; // used for between min and max
//         }
//     }
//     function timeout(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//       }
//     // hard variables
//     const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
//     const seedSeasons = ['Summer 2016', 'Fall 2016'];
//     const divisionList = [['1A', '2B',], ['AAA', 'AA']];
//     // const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
//     const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena'];

//     const counts = {
//         teams:   { min: 4,  max: 10, exact: 2 },         // teams per division - exact has priority
//         players: { min: 12, max: 16, exact: 5 },            // players per team - exact has priority
//         games:   { min: 5,  max: 8,  exact: 2 },         // games per team - exact has priority
//     }
//     const admins = [
//         // {email: 'owner@hockeydb.com',         admin_type: 'owner'},         // not doing anything with this yet
//         { email: 'admin@hockeydb.com',         admin_type: 'admin' },
//         { email: 'scorekeeper@hockeydb.com',   admin_type: 'scorekeeper' },    // not doing anything with this yet
//         { email: 'teammanager@hockeydb.com',   admin_type: 'manager' }         // not doing anything with this yet
//     ]


//     // create admins
//     const createAdmins = async () => {
//         return Promise.all( admins.map(async admin => {

//             const insertedAdmin = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), admin_type: admin.admin_type, email: admin.email});
//             const password = admin.admin_type;
//             const hash = await bcrypt.hash(password, 10);
//             await db.passwords.insert({ user_id: insertedAdmin.id, pw: hash });

//             return insertedAdmin;
//         }))
//     }


//     // create seasons
//     const createSeason = async (insertedAdmin) => {
//         return Promise.all( seedSeasons.map( async (seedSeason, idx ) => {
//                 const type = typesOfSeasons[randomr(typesOfSeasons.length)];
//                 const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: false, created_date: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create season error'))
//                 return createDivisions(idx, insertedSeason, insertedAdmin);
//             })
//         )
//     }


//     // create divisions
//     const createDivisions = async (idx, insertedSeason, insertedAdmin) => {
//         return Promise.all(
//             divisionList[idx].map(async division => {

//                 const { exact, min, max } = counts.teams;
//                 const randomTeamsCount = exact ? exact : randomr(min, max);
//                 const insertedDivision = await db.divisions.insert({ name: division, season_id: insertedSeason.id, created_date: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create division error'))

//                 const promises = [];
//                 for(let i = 0; i < randomTeamsCount; i++){
//                     promises.push(createTeams(insertedDivision, insertedSeason, insertedAdmin))
//                 }

//                 return Promise.all(promises);
//             })
//         )
//     }


//     // create teams
//     const createTeams = async (insertedDivision, insertedSeason, insertedAdmin) => {
//         const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
//         const { exact, min, max } = counts.players;

//         const randomPlayersCount = exact ? exact : randomr(min, max);

//         const name = `${teamList[randomr(teamList.length)]} ${teamList[randomr(teamList.length)]}s`;
//         const colors = `${faker.commerce.color()} / ${faker.commerce.color()}`;
//         await timeout(2000); // wait 2 seconds

//         const insertedTeam = await db.teams.insert({ name, colors, created_date: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create TEAMszzzzzz error'));
//         await db.team_season_division.insert({team_id: insertedTeam.id, season_id: insertedSeason.id, division_id: insertedDivision.id}).catch(err => console.log(err, 'create TEAMs error'));

//         // const promises = [];
//         // for(let i = 0; i < randomPlayersCount; i++){
//         //     promises.push(createPlayer(insertedTeam, insertedSeason, insertedAdmin))
//         // }

//         // return Promise.all(promises);
//     }


//     // create players
//     const createPlayer = async (insertedTeam, insertedSeason, insertedAdmin) => {
//         const first_name = faker.name.firstName();
//         const last_name = faker.name.lastName();
//         const email = faker.internet.email();
//         const insertedPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: insertedAdmin.id });
//         await db.player_stats.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
//         await db.players_teams.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season_id: insertedSeason.id});
//         return true;
//     }


//     // create games
//     const createGames = async (locations) => {
//         var newIndexDiv = 0;
//         await timeout(2000); // wait 2 seconds

//         return Promise.all(
//             seedSeasons.map(async (seedSeason, seasonIndex ) => {
//                 await timeout(2000); // wait 2 seconds

//                 return Promise.all(
//                     divisionList[seasonIndex].map(async (division, divisionIndex ) => {

//                         newIndexDiv += 1; // get db.division.id without getting into the db | this will cause problems when adding more seasons to seeding
//                         const n = newIndexDiv; // this avoids newIndexDiv to ALL be set to 6
//                         const { exact, min, max } = counts.games;
//                         const seasonGamesLength = exact ? exact : randomr(min, max);
//                         await timeout(2000); // wait 2 seconds
//                         let divisionTeams = await db.team_season_division.find({division_id: n, season_id: seasonIndex+1});

//                         Promise.all(
//                             Array(seasonGamesLength).fill().map(async (_, i) =>{
//                                 await timeout(2000); // wait 2 seconds

//                                 let home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
//                                 let away_team = divisionTeams[randomr(divisionTeams.length)].team_id;

//                                 const location_id = randomr(locations.length) + 1;
//                                 const start_date = faker.date.future();

//                                 // team cannot play itself
//                                 while (home_team === away_team){
//                                     home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
//                                     away_team = divisionTeams[randomr(divisionTeams.length)].team_id;
//                                 }

//                                 const game = await db.games.insert({ home_team, away_team, location_id, start_date, has_been_played: false });
//                                 await timeout(2000); // wait 2 seconds
//                                 await db.game_season_division.insert({ game_id: game.id, season_id: seasonIndex+1, division_id: n})
//                             })
//                         )
//                     })
//                 )
//             })
//         )
//     }


//     // create locations
//     const createLocations = async (admin) => {
//         return Promise.all( locationsList.map(async location => {
//             const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
//             return await db.locations.insert({ name: location, address, created_date: new Date(), created_by: admin.id }).catch(err => console.log(err, 'create location error'))
//         }))
//     }


//     // update games to played
//     const setGamesPlayed = async num => {
//         const games = await db.query('select * from games order by start_date limit $1', [num || 5]);

//         await db.season.update({ id: 1 }, { is_active: true });

//         return Promise.all(
//             Array(games.length).fill().map(async (_, i) => {
//                 await db.games.update({ id: games[i].id }, { has_been_played: true, home_score: randomr(0, 8), away_score: randomr(0, 8)});
//             })
//         )
//     }


//     const initiateSeed = async () => {

//         console.log('🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\  Initiating Seeding 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟','\n')
//         // drop and rebuild schema
//         await db.build_schema();
//         console.log('\ \ \ ✅\ \  Schema Rebuilt')
//           await timeout(2000); // wait 2 seconds

//         const admins = await createAdmins();
//         console.log('\ \ \ ✅\ \  Admins Created')
//         await timeout(2000); // wait 2 seconds

//         const allLocations = await createLocations(admins[0]);
//         console.log('\ \ \ ✅\ \  Locations Created')
//         await timeout(10000); // wait 2 seconds

//         await createSeason(admins[0]);
//         console.log('\ \ \ ✅\ \  Seasons Created')
//         await timeout(10000); // wait 2 seconds

//         await createGames(allLocations);
//         console.log('\ \ \ ✅\ \  Games Created')
//         await timeout(10000); // wait 2 seconds

//         await setGamesPlayed(10);
//         console.log('\n', '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\  Seeding Finished 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟')
//     }

//     initiateSeed()
// }).catch(err => {
//     console.log(err, 'massive error in npm run seed');
// });
