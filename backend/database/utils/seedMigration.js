/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
import massive from 'massive';
import faker from 'faker';
import bcrypt from 'bcrypt';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { add } from 'date-fns';
import { customAlphabet } from 'nanoid';
import { chunkArray, randomr, colorRandomizer, wait } from './seedHelpers.js';
import { selectEnvironment } from './selectEnvironment.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsPath = path.join(__dirname, '..', 'scripts');
const nanoid = customAlphabet('1234567890abcdef', 10);
const argv = process.argv.slice(2);
const connectionInfo = selectEnvironment(argv[1]);
const todaysDate = new Date();


// TODO: add more registrations based on seasons
// TODO: make password_last_updated_at same as account creation date (need to add to auth controller too)


const submissionValue = (player, submissionWithoutPlayer = false) => {
    if (submissionWithoutPlayer) {
        return {
            'First Name': faker.name.firstName(),
            'Last Name': faker.name.lastName(),
            'register-as': '0',
            'submission-key': nanoid(),
        };
    }
    return {
        'First Name': player.first_name,
        'Last Name': player.last_name,
        'Phone Number': '1234567890',
        'register-as': String(player.id) || '0',
        'submission-key': nanoid(),
    };
};


export const dropTables = async () => massive(connectionInfo, { excludeMatViews: true, scripts: scriptsPath }).then(async (db) => {
    console.log('\n\nDropping tables');
    console.log('---------------');

    const tableCount = (await db.listTables()).length;
    await db.drop_tables();

    await wait(1000);

    console.log(` ✅ ${tableCount} tables removed`);
    console.log('--------------------');
    console.log('Drop tables complete\n');
    db.instance.$pool.end();
    return true;
});


export const seedTables = async () => massive(connectionInfo, { excludeMatViews: true }).then(async (db) => {
    console.log('\nInitializing seeding');
    console.log('--------------------');

    // hard variables
    const typesOfSeasons = ['Regular', 'Playoffs', 'Tournament'];
    const seasonsList = ['Summer 2020', 'Fall 2021', 'Summer 2021'];
    const divisionList = ['1A', '2B', '3C', '4D'];
    const locationsList = ['Kingsgate Arena', 'Showare Stadium', 'Key Arena', 'Center Ice Arena', 'The Cooler', 'The Igloo', 'The Coliseum'];
    const counts = {
        teams: { min: 20, max: 30, exact: null }, // teams per division - exact has priority
        games: { min: 5, max: 8, exact: null }, // games per team - exact has priority
        players: { min: 9, max: 16, exact: null }, // players per team - exact has priority
        totalPlayers: 200,
    };
    const users = [
        { email: 'super@hockeydb.com', role_id: 1 },
        { email: 'admin@hockeydb.com', role_id: 2 },
        { email: 'scorekeeper@hockeydb.com', role_id: 3 }, // not doing anything with this role yet
        { email: 'teammanager@hockeydb.com', role_id: 4 }, // not doing anything with this role yet
        { email: 'multiaccounts@hockeydb.com', role_id: 5 },
    ];
    const newsPosts = [
        { title: 'Registrations Open Soon', display_order: 1, body: '<p>Signups start May 1st. Look for the registration link emails to be sent out soon</p>' },
        { title: 'Welcome to our league', display_order: 2, body: '<p>As we look to work out some of the kinks of a new league, we\'re looking to add some new features in the near future.</p><p><br></p><p><strong><em>Features that include:</em></strong></p><ul><li>Registrations</li><li>Player Stats</li><li>Payments</li><li>Email Notifications</li><li>Messaging</li><li>Native Phone App</li></ul><p><br></p><p>All with a fun, friendly, and easy to use user interface (UI).</p>' },
    ];

    // create users
    const createUsers = async () => Promise.all(users.map(async user => {
        const insertedUser = await db.users.insert({ first_name: faker.name.firstName(), last_name: faker.name.lastName(), email: user.email, created_at: todaysDate });
        const password = process.env.TESTING_PASSWORD;
        const hash = await bcrypt.hash(password, 10);
        await db.passwords.insert({ user_id: insertedUser.id, pw: hash });
        await db.user_role.insert({ user_id: insertedUser.id, role_id: user.role_id });
        return insertedUser;
    }));

    // create seasons
    const createSeason = async ({ admin }) => Promise.all(seasonsList.map(async (seedSeason, idx) => {
        const type = typesOfSeasons[randomr(typesOfSeasons.length)];
        const isLastSeasonInList = (idx + 1) === seasonsList.length;
        const insertedSeason = await db.seasons.insert({ name: seedSeason, type, is_active: !!isLastSeasonInList, created_at: todaysDate, start_date: add(todaysDate, { months: idx * 2 }), created_by: admin.id });
        return insertedSeason;
    }));

    // create divisions
    const createDivisions = async ({ admin }) => Promise.all(divisionList.map(async division => {
        const insertedDivision = await db.divisions.insert({ name: division, created_at: todaysDate, created_by: admin.id });
        return insertedDivision;
    }));

    // create 24 teams
    // divide it out by 4 divisions

    // create teams
    // const createTeams = async ({ admin }) => Promise.all(Array(counts.teams.exact).fill().map(async () => {
    //     const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
    //     const name = `${faker.address.city()} ${teamList[randomr(teamList.length)]}s`;
    //     const colors = colorRandomizer();
    //     const insertedTeam = await db.teams.insert({ name, colors, created_at: todaysDate, created_by: admin.id });
    //     return insertedTeam;
    // }));

    const createTeams = async ({ admin }) => {
        const { exact, min, max } = counts.teams;
        const teamsCount = exact || randomr(min, max);

        return Promise.all(Array(teamsCount).fill().map(async () => {
            const teamList = [faker.hacker.adjective(), faker.hacker.noun(), faker.hacker.verb()];
            const name = `${faker.address.city()} ${teamList[randomr(teamList.length)]}s`;
            const colors = colorRandomizer();
            const insertedTeam = await db.teams.insert({ name, colors, created_at: todaysDate, created_by: admin.id });
            return insertedTeam;
        }));
    };

    // create players
    // const createPlayers = async ({ admin }) => Promise.all(Array(counts.totalPlayers).fill().map(async () => {
    //     const first_name = faker.name.firstName();
    //     const last_name = faker.name.lastName();
    //     const email = faker.internet.email();
    //     await db.players.insert({ first_name, last_name, email, created_at: todaysDate, created_by: admin.id });
    // }));

    const createPlayers = async (createdUsers) => {
        // create player accounts for last two users
        const last2 = createdUsers.slice(-2);

        await Promise.all(last2.map(async user => {
            const { first_name, last_name, id } = user;
            await db.players.insert({ first_name, last_name, created_at: todaysDate, created_by: id });
        }));

        // create player accounts
        return Promise.all(Array(counts.totalPlayers).fill().map(async () => {
            const first_name = faker.name.firstName();
            const last_name = faker.name.lastName();
            await db.players.insert({ first_name, last_name, created_at: todaysDate, created_by: createdUsers[0].id });
        }));
    };

    // associate teams to seasons and divisions
    const associateTeamsToSeasonsDivisions = async () => {
        const createdSeasons = await db.seasons.find();
        const createdTeams = await db.teams.find();
        const createdDivisions = await db.divisions.find();

        // 24 teams
        // 6 teams per division
        // 3 seasons

        const chunkedDivisions = chunkArray(createdTeams, 6);

        return Promise.all(createdSeasons.map(season => Promise.all(createdDivisions.map((div, i) => {
            const section = chunkedDivisions[i];
            return Promise.all(section.map(async sec => {
                await db.team_season_division.insert({ team_id: sec.id, season_id: season.id, division_id: div.id });
            }));
        }))));
    };

    // associate players to teams and seasons
    const associatePlayersToTeamsSeasons = async () => {
        const createdSeasons = await db.seasons.find();
        const createdTeams = await db.teams.find();
        const createdPlayers = await db.players.find();

        return Promise.all(createdPlayers.map(player => {
            const createdTeamsCopy = [...createdTeams];
            const myTeam = createdTeamsCopy.splice(randomr(createdTeamsCopy.length - 1), 1);

            return Promise.all(createdSeasons.map(season => Promise.all(myTeam.map(async team => {
                const goals = randomr(30);
                const assists = randomr(40);
                await db.player_stats.insert({ player_id: player.id, team_id: team.id, season_id: season.id, games_played: randomr(10, 20), goals, assists, points: (goals + assists), penalties_in_minutes: randomr(11), game_winning_goals: randomr(6), power_play_goals: randomr(4), short_handed_goals: randomr(0, 1), goals_per_game: 0, assists_per_game: 0, points_per_game: 0 });
                await db.player_team_season.insert({ player_id: player.id, team_id: team.id, season_id: season.id });
            }))));
        }));
    };

    const createGames = async ({ admin }) => {
        const locations = await db.locations.find();
        const createdDivisions = await db.divisions.find();
        const createdSeasons = await db.seasons.find();

        // create games for one division
        // teams must be in division
        // teams cannot play itself

        return Promise.all(createdSeasons.map(season => Promise.all(createdDivisions.map(async division => {
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

                // set team_season_division stats here

                if (!season.is_active) {
                    let home_points = 0;
                    let away_points = 0;
                    if (home_score > away_score) {
                        home_points = 2;
                    } else if (away_score > home_score) {
                        away_points = 2;
                    } else if (home_score === away_score) {
                        home_points = 1;
                        away_points = 1;
                    }

                    const home_stats = {
                        games_played: 'games_played + 1',
                        wins: `wins + ${home_score > away_score ? 1 : 0}`,
                        losses: `losses + ${home_score < away_score ? 1 : 0}`,
                        ties: `ties + ${home_score === away_score ? 1 : 0}`,
                        points: `points + ${home_points}`,
                        goals_for: `goals_for + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
                        goals_against: `goals_against + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
                        penalties_in_minutes: `penalties_in_minutes + ${0}`,

                        // games_played: home.games_played + 1,
                        // wins: home.wins + (home_score > away_score ? 1 : 0),
                        // losses: home.losses + (home_score < away_score ? 1 : 0),
                        // ties: home.ties + (home_score === away_score ? 1 : 0),
                        // points: home.points + home_points,
                        // goals_for: home.goals_for + (gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score),
                        // goals_against: home.goals_against + (gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score),
                        // penalties_in_minutes: home.penalties_in_minutes + 0,
                    };

                    const away_stats = {
                        games_played: 'games_played + 1',
                        wins: `wins + ${away_score > home_score ? 1 : 0}`,
                        losses: `losses + ${away_score < home_score ? 1 : 0}`,
                        ties: `ties + ${away_score === home_score ? 1 : 0}`,
                        points: `points + ${away_points}`,
                        goals_for: `goals_for + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
                        goals_against: `goals_against + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
                        penalties_in_minutes: `penalties_in_minutes + ${0}`,
                    };

                    // console.log({ home_stats, away_stats })
                    // update home_team stats
                    await db.team_season_division.update({ team_id: home_team, season_id: season.id, division_id: division.id }, {
                        $set: { ...home_stats },
                    });

                    // update away_team stats
                    await db.team_season_division.update({ team_id: away_team, season_id: season.id, division_id: division.id }, {
                        $set: { ...away_stats },
                    });
                }
            }));
        }))));
    };


    // create locations
    const createLocations = async ({ admin }) => Promise.all(locationsList.map(async location => {
        const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()}`;
        const createdLocation = await db.locations.insert({ name: location, address, created_at: todaysDate, created_by: admin.id });
        return createdLocation;
    }));


    const setActiveSeasonGamesPlayed = async ({ admin }) => {
        // get the first 8 games of the season and set them to played (with team stats)
        const query = `
            select * from seasons s
            join game_season_division gsd on gsd.season_id = s.id
            join games g on g.id = gsd.game_id
            where s.is_active = true order by s.start_date limit 8;
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


            let home_points = 0;
            let away_points = 0;
            if (home_score > away_score) {
                home_points = 2;
            } else if (away_score > home_score) {
                away_points = 2;
            } else if (home_score === away_score) {
                home_points = 1;
                away_points = 1;
            }

            const home_stats = {
                games_played: 'games_played + 1',
                wins: `wins + ${home_score > away_score ? 1 : 0}`,
                losses: `losses + ${home_score < away_score ? 1 : 0}`,
                ties: `ties + ${home_score === away_score ? 1 : 0}`,
                points: `points + ${home_points}`,
                goals_for: `goals_for + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
                goals_against: `goals_against + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
                penalties_in_minutes: `penalties_in_minutes + ${0}`,
            };

            const away_stats = {
                games_played: 'games_played + 1',
                wins: `wins + ${away_score > home_score ? 1 : 0}`,
                losses: `losses + ${away_score < home_score ? 1 : 0}`,
                ties: `ties + ${away_score === home_score ? 1 : 0}`,
                points: `points + ${away_points}`,
                goals_for: `goals_for + ${gameStats.away_first_score + gameStats.away_second_score + gameStats.away_third_score}`,
                goals_against: `goals_against + ${gameStats.home_first_score + gameStats.home_second_score + gameStats.home_third_score}`,
                penalties_in_minutes: `penalties_in_minutes + ${0}`,
            };

            // update home_team stats
            await db.team_season_division.update({ team_id: game.home_team, season_id: game.season_id, division_id: game.division_id }, {
                $set: { ...home_stats },
            });

            // update away_team stats
            await db.team_season_division.update({ team_id: game.away_team, season_id: game.season_id, division_id: game.division_id }, {
                $set: { ...away_stats },
            });
        }));
    };

    // create news post
    const createNews = async ({ admin }) => {
        const createdTags = await db.tags.find();

        // add news post
        await Promise.all(newsPosts.map(async singleNewsPost => {
            const { title, display_order, body } = singleNewsPost;
            const createdNewsPost = await db.news.insert({ title, display_order, body, created_at: todaysDate, created_by: admin.id });


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


    const createRegistrationTemplates = async ({ admin }) => {
        // add registration template
        await db.registrations_templates.insert({ name: 'Test Registration 1', is_open: true, season_id: 2, created_at: todaysDate, created_by: admin.id, max_spots: 20, show_max_spots: true });
        await db.registrations_templates.insert({ name: 'Test Registration 2', is_open: false, season_id: 2, created_at: todaysDate, created_by: admin.id, show_max_spots: true });

        // add default fields
        await db.registrations_default_fields.insert({ field_type: 'text', label: 'First Name', is_required: true, locked: true, section: 'Basic Info', section_display_index: 1, display_index: 1 });
        await db.registrations_default_fields.insert({ field_type: 'text', label: 'Last Name', is_required: true, locked: true, section: 'Basic Info', section_display_index: 1, display_index: 2 });
        await db.registrations_default_fields.insert({ field_type: 'text', label: 'Phone Number', hint: '222-222-2222', section: 'Basic Info', section_display_index: 1, display_index: 3 });


        // to use, must put all not nulls in all objects (need to add locked: false to phone number insert)
        // await db.registrations_default_fields.insert([
        //     { field_type: 'text', label: 'First Name', is_required: true, locked: true, section: 'Basic Info', section_display_index: 1, display_index: 1 },
        //     { field_type: 'text', label: 'Last Name', is_required: true, locked: true, section: 'Basic Info', section_display_index: 1, display_index: 2 },
        //     { field_type: 'text', label: 'Phone Number', hint: '222-222-2222', section: 'Basic Info', section_display_index: 1, display_index: 3 },
        // ]);

        // add form fields made by admin
        const query = `
            INSERT INTO "registrations_fields" (field_type, label, hint, options, is_required, locked, registration_template_id, section, section_display_index, display_index)
            SELECT field_type, label, hint, options, is_required, locked, 1, section, section_display_index, display_index FROM "registrations_default_fields";
        `;
        await db.query(query);

        await db.registrations_fields.insert({ registration_template_id: 1, field_type: 'text', label: 'Previous Team', hint: 'Here be a hint/tooltip', section: 'Sports Info', section_display_index: 2, display_index: 2 });
        await db.registrations_fields.insert({ registration_template_id: 1, field_type: 'select', label: 'Shirt Size', hint: 'Use the dropdown to select a size', options: '{"XS": "Extra Small", "S": "Small"}', is_required: true, section: 'Sports Info', section_display_index: 2, display_index: 3 });
        await db.registrations_fields.insert({ registration_template_id: 1, field_type: 'checkbox', label: 'Do you also coach?', hint: 'Check the box if you coach any level', section: 'Sports Info', section_display_index: 2, display_index: 3 });
    };

    const createPlayerRegistrations = async (createdUsers) => {
        // create player registrations for last two users
        const last2 = createdUsers.slice(-2);

        const createdRegistrationTemplates = await db.registrations_templates.find();
        const createdPlayers = await db.players.find();
        const usedPlayerIds = [];

        return Promise.all(last2.map(async user => {
            const associatedAccounts = randomr(1, 6);
            // const [usersPlayerAccount] = await db.players.find({ email: user.email });
            const [usersPlayerAccount, ...restOfPlayers] = await db.players.find({ created_by: user.id });

            let playerId = usersPlayerAccount.id;

            return Promise.all(createdRegistrationTemplates.map(async template => {
                if (template.is_open) {
                    return Promise.all(Array(associatedAccounts).fill().map(async () => {
                        while (usedPlayerIds.includes(playerId)) {
                            playerId = randomr(1, createdPlayers.length);
                        }

                        // console.log({ 'player id: ': playerId, 'user id: ': user.id });
                        // console.log('break -');
                        // console.log(createdPlayers, 'plaerys');

                        // TODO: promise is firing and updating the db.players.update to a single value
                        // instead of updating each one individually. believe it's an await issue

                        // console.log(restOfPlayers, 'restOfPlayers') // empty array

                        // const subValue = submissionValue();

                        // if ()




                        // TODO: only add 3 accounts to the multiaccounts user - dont worry about adding it to the team manager account




                        const myPlayer = createdPlayers.find(p => p.id === playerId);

                        // console.log(myPlayer, 'MY PLAYRE')

                        const subValue = submissionValue(myPlayer);

                        // console.log(subValue, 'SUB VALUEEEE')


                        usedPlayerIds.push(playerId);
                        await db.registrations_submissions.insert({ user_id: user.id, registration_template_id: 1, value: subValue, player_id: playerId, created_at: todaysDate });
                        await wait(4000);

                        await db.players.update({ id: playerId }, { parent_id: user.id });
                    }));
                }
                return null;
            }));
        }));
    };


    const initiateSeed = async () => {
        const createdUsers = await createUsers();
        console.log(' ✅ Users Created');

        await createLocations({ admin: createdUsers[0] });
        console.log(' ✅ Locations Created');

        await createDivisions({ admin: createdUsers[0] });
        console.log(' ✅ Divisions Created');

        await createSeason({ admin: createdUsers[0] });
        console.log(' ✅ Seasons Created');

        await createTeams({ admin: createdUsers[0] });
        console.log(' ✅ Teams Created');

        // await createPlayers({ admin: createdUsers[0] });
        await createPlayers(createdUsers);

        console.log(' ✅ Players Created');

        await associateTeamsToSeasonsDivisions();
        console.log(' ✅ Teams Seasons Divisions Associated');

        await associatePlayersToTeamsSeasons();
        console.log(' ✅ Players Teams Seasons Associated');


        // need to loop over each team and make sure there are no dupilicate numbers on the same team
        // await associateNumbersToPlayersPerSeason();
        // console.log('   ✅   Player Numbers Associated');

        await createGames({ admin: createdUsers[0] });
        console.log(' ✅ Games Created');

        await setActiveSeasonGamesPlayed({ admin: createdUsers[0] });
        console.log(' ✅ Current Season\' Games Updated');

        await createNews({ admin: createdUsers[0] });
        console.log(' ✅ News Created');

        await createRegistrationTemplates({ admin: createdUsers[0] });
        console.log(' ✅ Registration Templates Created');

        await createPlayerRegistrations(createdUsers);
        console.log(' ✅ Player Registrations Created');

        console.log('--------------------');
        console.log('Seeding complete \n \n');

        db.instance.$pool.end();
        return true;
    };


    return initiateSeed();
    // console.log('disconnecting from massive [seedTables]')
}).catch(err => {
    console.log(err, 'massive error in npm run seed');
});
