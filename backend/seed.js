const massive = require('massive');
const faker = require('faker');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectionInfo = process.env.DB_URI;

// helper functions

// this function takes an array and divides it out into an array of multiple arrays depeneding on SIZE variable
const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const randomr = (num, max) => {
    if (num && !max) {
        return Math.floor(Math.random() * num); // mainly used for array indexs
    }
    return Math.floor(Math.random() * (max - num + 1)) + num; // used for between min and max
};

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

// connect to database
massive(connectionInfo, { excludeMatViews: true }).then(async (db) => {
    // hard variables
    const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
    const seasonsList = ['Summer 2020', 'Fall 2021', 'Summer 2021'];
    const divisionList = ['1A', '2B', '3C', '4D'];
    const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
    const counts = {
        teams: { min: 4, max: 10, exact: 24 }, // teams per division - exact has priority
        games: { min: 5, max: 8, exact: null }, // games per team - exact has priority
        players: { min: 9, max: 16, exact: null }, // players per team - exact has priority
        totalPlayers: 200,
    };
    const users = [
        { email: 'super@hockeydb.com', admin_type: 'super', role_id: 1 },
        { email: 'admin@hockeydb.com', admin_type: 'admin', role_id: 2 },
        { email: 'scorekeeper@hockeydb.com', admin_type: 'scorekeeper', role_id: 3 }, // not doing anything with this role yet
        { email: 'teammanager@hockeydb.com', admin_type: 'manager', role_id: 4 }, // not doing anything with this role yet
        { email: 'mutliaccounts@hockeydb.com', admin_type: 'player', role_id: 5 },
    ];
    const newsPosts = [
        { title: 'Registrations Open Soon', display_order: 1, body: '<p>Signups start May 1st. Look for the registration link emails to be sent out soon</p>' },
        { title: 'Welcome to our league', display_order: 2, body: '<p>As we look to workout some of the kinks of a new league, we\'re looking to add some new features in the near future.</p><p><br></p><p><strong><em>Features that include:</em></strong></p><ul><li>Registrations</li><li>Player Stats</li><li>Payments</li><li>Email Notifications</li><li>Messaging</li><li>Native Phone App</li></ul><p><br></p><p>All with a fun, friendly, and easy to use user interface (UI).</p>' },
    ];


    // create admins
    const createUsers = async () => Promise.all(users.map(async user => {
        const insertedUser = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), admin_type: user.admin_type, email: user.email, created_at: new Date() });
        const password = process.env.TESTING_PASSWORD;
        const hash = await bcrypt.hash(password, 10);
        await db.passwords.insert({ user_id: insertedUser.id, pw: hash });
        await db.user_role.insert({ user_id: insertedUser.id, role_id: user.role_id });
        return insertedUser;
    }));

    // create seasons
    const createSeason = async ({ admin }) => {
        return Promise.all(seasonsList.map(async (seedSeason, idx) => {
            const type = typesOfSeasons[randomr(typesOfSeasons.length)];
            const isLastSeasonInList = (idx + 1) === seasonsList.length;
            const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: isLastSeasonInList ? true : false, created_at: new Date(), created_by: admin.id });
            return insertedSeason;
        }));
    };

    // create divisions
    const createDivisions = async ({ admin }) => {
        return Promise.all(divisionList.map(async division => {
            const insertedDivision = await db.divisions.insert({ name: division, created_at: new Date(), created_by: admin.id });
            return insertedDivision;
        }));
    };

    // create 24 teams
    // divide it out by 4 divisions

    // create teams
    const createTeams = async ({ admin }) => Promise.all(Array(counts.teams.exact).fill().map(async () => {
        const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
        const name = `${faker.address.city()} ${teamList[randomr(teamList.length)]}s`;
        const colors = colorRandomizer();
        const insertedTeam = await db.teams.insert({ name, colors, created_at: new Date(), created_by: admin.id });
        return insertedTeam;
    }));


    // create players
    const createPlayers = async ({ admin }) => Promise.all(Array(counts.totalPlayers).fill().map(async () => {
        const first_name = faker.name.firstName();
        const last_name = faker.name.lastName();
        const email = faker.internet.email();
        await db.players.insert({ first_name, last_name, email, created_at: new Date(), created_by: admin.id });
    }));


    // associate teams to seasons and divisions
    const associateTeamsToSeasonsDivisions = async () => {
        const createdSeasons = await db.seasons.find();
        const createdTeams = await db.teams.find();
        const createdDivisions = await db.divisions.find();

        // 24 teams
        // 6 teams per division
        // 3 seasons

        // chunkedDivisions takes all the createdTeams (24) and divides them in to the 6 divisions
        const chunkedDivisions = chunkArray(createdTeams, 6);

        return Promise.all(createdSeasons.map(season => {
            return Promise.all(createdDivisions.map((div, i) => {
                const section = chunkedDivisions[i];
                return Promise.all(section.map(async sec => {
                    await db.team_season_division.insert({ team_id: sec.id, season_id: season.id, division_id: div.id });
                }));
            }));
        }));
    };


    // associate players to teams and seasons
    const associatePlayersToTeamsSeasons = async () => {
        const createdSeasons = await db.seasons.find();
        const createdTeams = await db.teams.find();
        const createdPlayers = await db.players.find();

        return Promise.all(createdPlayers.map(player => {
            const createdTeamsCopy = [...createdTeams];
            const myTeam = createdTeamsCopy.splice(randomr(createdTeamsCopy.length - 1), 1);

            return Promise.all(createdSeasons.map(season => {
                return Promise.all(myTeam.map(async team => {
                    const goals = randomr(30);
                    const assists = randomr(40);
                    await db.player_stats.insert({ player_id: player.id, team_id: team.id, season_id: season.id, games_played: randomr(10, 20), goals, assists, points: (goals + assists), penalties_in_minutes: randomr(11), game_winning_goals: randomr(6), power_play_goals: randomr(4), short_handed_goals: randomr(0, 1), goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
                    await db.player_team_season.insert({ player_id: player.id, team_id: team.id, season_id: season.id });
                }));
            }));
        }));
    };

    const createGames = async ({ admin }) => {
        const locations = await db.locations.find();
        const createdDivisions = await db.divisions.find();
        const createdSeasons = await db.seasons.find();

        // create games for one division
        // teams must be in division
        // teams cannot play itself

        return Promise.all(createdSeasons.map(season => {
            return Promise.all(createdDivisions.map(async division => {
                // const { exact, min, max } = counts.games;
                const seasonGamesLength = 12; // exact || randomr(min, max);
                const divisionTeams = await db.team_season_division.find({ division_id: division.id, season_id: 1 });

                return Promise.all(Array(seasonGamesLength).fill().map(async () => {
                    let home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                    let away_team = divisionTeams[randomr(divisionTeams.length)].team_id;

                    const location_id = randomr(locations.length) + 1;
                    const start_date = season.is_active ? faker.date.future() : faker.date.past();

                    // team cannot play itself
                    while (home_team === away_team) {
                        home_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                        away_team = divisionTeams[randomr(divisionTeams.length)].team_id;
                    }

                    const gameStats = {
                        home_first_score: season.is_active ? 0 : randomr(5),
                        home_second_score: season.is_active ? 0 : randomr(5),
                        home_third_score: season.is_active ? 0 : randomr(3),
                        home_first_sog: season.is_active ? 0 : randomr(13),
                        home_second_sog: season.is_active ? 0 : randomr(10),
                        home_third_sog: season.is_active ? 0 : randomr(10),
                        // home_first_pim: randomr(2),
                        // home_second_pim: randomr(2),
                        // home_third_pim: randomr(2),
                        away_first_score: season.is_active ? 0 : randomr(5),
                        away_second_score: season.is_active ? 0 : randomr(5),
                        away_third_score: season.is_active ? 0 : randomr(3),
                        away_first_sog: season.is_active ? 0 : randomr(13),
                        away_second_sog: season.is_active ? 0 : randomr(10),
                        away_third_sog: season.is_active ? 0 : randomr(10),
                        // away_first_pim: randomr(2),
                        // away_second_pim: randomr(2),
                        // away_third_pim: randomr(2),
                    };

                    const home_score = (gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score);
                    const away_score = (gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score);

                    const game = await db.games.insert({ home_team, away_team, has_been_played: !season.is_active, created_by: admin.id, location_id, start_date, home_score, away_score, ...gameStats });
                    await db.game_season_division.insert({ game_id: game.id, season_id: season.id, division_id: division.id });
                }));
            }));
        }));
    };


    // create locations
    const createLocations = async ({ admin }) => Promise.all(locationsList.map(async location => {
        const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
        const createdLocation = await db.locations.insert({ name: location, address, created_at: new Date(), created_by: admin.id });
        return createdLocation;
    }));


    const setActiveSeasonGamesPlayed = async ({ admin }) => {
        // get the first 8 games of the season and set them to played (with team stats)
        const query = `
            select * from seasons s
            join game_season_division gsd on gsd.season_id = s.id
            join games g on g.id = gsd.game_id
            where s.is_active = true order by start_date limit 8;
        `;

        const selectedGames = await db.query(query);

        return Promise.all(selectedGames.map(async game => {
            const gameStats = {
                home_first_score: randomr(5),
                home_second_score: randomr(5),
                home_third_score: randomr(3),
                home_first_sog: randomr(13),
                home_second_sog: randomr(10),
                home_third_sog: randomr(10),
                // home_first_pim: randomr(2),
                // home_second_pim: randomr(2),
                // home_third_pim: randomr(2),
                away_first_score: randomr(5),
                away_second_score: randomr(5),
                away_third_score: randomr(3),
                away_first_sog: randomr(13),
                away_second_sog: randomr(10),
                away_third_sog: randomr(10),
                // away_first_pim: randomr(2),
                // away_second_pim: randomr(2),
                // away_third_pim: randomr(2),
            };

            const home_score = (gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score);
            const away_score = (gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score);

            await db.games.update({ id: game.id }, { has_been_played: true, updated_by: admin.id, home_score, away_score, ...gameStats });
        }));
    };

    // create news post
    const createNews = async ({ admin }) => {
        const createdTags = await db.tags.find();

        // add news post
        await Promise.all(newsPosts.map(async singleNewsPost => {
            const { title, display_order, body } = singleNewsPost;
            const createdNewsPost = await db.news.insert({ title, display_order, body, created_at: new Date(), created_by: admin.id });


            // put random item associated to creatednewPost
            const tagsToUse = [];
            for (let i = 0; i < randomr(0, createdTags.length - 1);) {
                const random = Math.floor(Math.random() * createdTags.length);
                if (tagsToUse.indexOf(createdTags[random]) !== -1) {
                    continue;
                }
                tagsToUse.push(createdTags[random]);
                i++;
            }

            // add tags to post
            await Promise.all(tagsToUse.map(async tag => {
                await db.news_tags.insert({ tag_id: tag.id, news_id: createdNewsPost.id });
            }));
        }));
    };


    const initiateSeed = async () => {
        console.log('🌟🌟🌟🌟🌟  Initiating Seeding  🌟🌟🌟🌟🌟', '\n');
        // drop and rebuild schema
        await db.build_schema();
        console.log('   ✅   Schema Built');

        const createdUsers = await createUsers();
        console.log('   ✅   Admins Created');

        await createLocations({ admin: createdUsers[0] });
        console.log('   ✅   Locations Created');

        await createDivisions({ admin: createdUsers[0] });
        console.log('   ✅   Divisions Created');

        await createSeason({ admin: createdUsers[0] });
        console.log('   ✅   Seasons Created');

        await createTeams({ admin: createdUsers[0] });
        console.log('   ✅   Teams Created');

        await createPlayers({ admin: createdUsers[0] });
        console.log('   ✅   Players Created');

        await associateTeamsToSeasonsDivisions();
        console.log('   ✅   Teams Seasons Divisions Associated');

        await associatePlayersToTeamsSeasons();
        console.log('   ✅   Players Teams Seasons Associated');

        await createGames({ admin: createdUsers[0] });
        console.log('   ✅   Games Created');

        await setActiveSeasonGamesPlayed({ admin: createdUsers[0] });
        console.log('   ✅   Current Season\' Games Updated');

        await createNews({ admin: createdUsers[0] });
        console.log('   ✅   News Created');

        console.log('\n', '🌟🌟🌟🌟🌟  Seeding Finished  🌟🌟🌟🌟🌟');
    };

    initiateSeed();
}).catch(err => {
    console.log(err, 'massive error in npm run seed');
});

// ///////////////////////////
// ///////////////////////////


// FOR ELEPHANT SQL!!!!


// ///////////////////////////
// ///////////////////////////


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
//     const seasonsList = ['Summer 2016', 'Fall 2016'];
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
//         return Promise.all( seasonsList.map( async (seedSeason, idx ) => {
//                 const type = typesOfSeasons[randomr(typesOfSeasons.length)];
//                 const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: false, created_at: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create season error'))
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
//                 const insertedDivision = await db.divisions.insert({ name: division, season_id: insertedSeason.id, created_at: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create division error'))

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

//         const insertedTeam = await db.teams.insert({ name, colors, created_at: new Date(), created_by: insertedAdmin.id }).catch(err => console.log(err, 'create TEAMszzzzzz error'));
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
//         const insertedPlayer = await db.players.insert({ first_name, last_name, email, created_at: new Date(), created_by: insertedAdmin.id });
//         await db.player_stats.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
//         await db.player_team_season.insert({ player_id: insertedPlayer.id, team_id: insertedTeam.id, season_id: insertedSeason.id});
//         return true;
//     }


//     // create games
//     const createGames = async (locations) => {
//         var newIndexDiv = 0;
//         await timeout(2000); // wait 2 seconds

//         return Promise.all(
//             seasonsList.map(async (seedSeason, seasonIndex ) => {
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
//             return await db.locations.insert({ name: location, address, created_at: new Date(), created_by: admin.id }).catch(err => console.log(err, 'create location error'))
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
