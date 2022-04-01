const app = require('../server.js');

const getAllTeams = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { division, season, orderby } = req.query;

        const season_id = await db.seasons.findOne({ name: season, 'deleted_at =': null });
        const divisions = await db.divisions.find({ season_id: season_id.id });
        const seasons = await db.seasons.find({ 'hidden_at =': null, 'deleted_at =': null });

        let query = `
            SELECT teams.*, seasons.name AS season_name, seasons.id AS season_id, divisions.name AS division_name, divisions.id AS division_id FROM team_season_division tsd 
            JOIN teams ON teams.id = tsd.team_id
            JOIN seasons ON seasons.id = tsd.season_id
            JOIN divisions ON divisions.id = tsd.division_id
            WHERE tsd.season_id = ${season_id.id} AND ${!!division ? 'divisions.name = $1' : 'tsd.division_id is not null'}
        `;

        if (orderby) {
            query += 'ORDER BY lower(teams.name)';
        } else {
            query += 'ORDER BY division_name, lower(teams.name)';
        }

        const data = await db.query(query, [division, orderby]);
        return res.send({ status: 200, data: { teams: data, divisions, seasons }, message: 'Retrieved list of teams' });
    } catch (error) {
        console.log('GET TEAMS ERROR: ', error);
        return next(error);
    }
};


const getAllTeamsByDivision = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { season } = req.query;
        let season_id;

        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        const query = `
            SELECT 
            d.name AS division_name, jsonb_agg(jsonb_build_object('name', t.name, 'id', t.id)) AS teams_in_division 
            FROM team_season_division tsd
            INNER join teams t ON t.id = tsd.team_id
            INNER join divisions d ON d.id = tsd.division_id
            WHERE tsd.season_id = ${season || season_id.id}
            GROUP BY d.id, d.name ORDER BY d.name;
        `;

        const data = await db.query(query);
        return res.send({ status: 200, data: { allTeams: data, season: season || season_id.id }, message: 'Retrieved list of teams grouped by division' });
    } catch (error) {
        console.log('GET ALL TEAMS BY DIVISION ERROR: ', error);
        return next(error);
    }
};

const getTeamById = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const { season } = req.query;
        let season_id;

        const confirmTeam = await db.teams.findOne({ id });
        if (!confirmTeam) {
            return res.send({ status: 404, data: [], message: 'Team cannot be found', redirect: '/teams' });
        }

        // get schedule
        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        const teamQuery = `
            SELECT t.id, t.name, t.colors, d.name AS division_name, d.id AS division_id FROM team_season_division tsd
            JOIN teams t ON t.id = tsd.team_id
            JOIN divisions d ON d.id = tsd.division_id
            WHERE tsd.season_id = ${season || season_id.id} AND tsd.team_id = $1
        `;

        const team = await db.query(teamQuery, [id]);

        if (team.length <= 0) {
            return res.send({ status: 404, data: [], message: 'Team did not play in this season', redirect: '/teams', notification_type: 'snack' });
        }

        // this seasons returns ALL seasons for team page
        const seasons = await db.query('SELECT id, name, is_active FROM seasons WHERE deleted_at IS null AND hidden_at IS null ORDER BY id;');

        // *** this seasons returns ONLY seasons associated with the team - some teams dont play every season ***
        const seasonsSelectQuery = `
            SELECT s.id, s.name, s.is_active FROM team_season_division tsd
            JOIN seasons s ON s.id = tsd.season_id
            WHERE tsd.team_id = $1 AND deleted_at IS null AND hidden_at IS null ORDER BY id;
        `;
        const seasonsSelect = await db.query(seasonsSelectQuery, [id]);

        const recordQuery = `
            SELECT games_played, wins, losses, ties, points, goals_for, goals_against, penalties_in_minutes FROM team_season_division WHERE season_id = ${season || season_id.id} AND team_id = $1;
        `;

        const record = await db.query(recordQuery, [id]);

        const recentQuery = `
            SELECT g.id, g.start_date, g.home_score, g.away_score, g.has_been_played,
            h.name AS home_team, h.id AS home_team_id,
            a.name AS away_team, a.id AS away_team_id,
            locations.name AS location_name, locations.id AS location_id,
            seasons.name AS season_name, divisions.name AS division_name 
            FROM game_season_division gsd 
            JOIN games g ON g.id = gsd.game_id
            JOIN teams h ON h.id = g.home_team
            JOIN teams a ON a.id = g.away_team
            JOIN seasons ON seasons.id = gsd.season_id
            JOIN divisions ON divisions.id = gsd.division_id
            JOIN locations ON locations.id = g.location_id
            WHERE gsd.season_id = ${season || season_id.id} AND (h.id = $1 OR a.id = $1) AND g.has_been_played = true
            ORDER BY g.start_date desc limit 5;
        `;

        const recent = await db.query(recentQuery, [id]);

        const standingsQuery = `
            SELECT t.id AS team_id, t.name AS team_name, tsd.games_played, tsd.points, tsd.goals_for 
            FROM team_season_division tsd
            JOIN teams t ON t.id = tsd.team_id
            JOIN divisions d ON d.id = tsd.division_id
            WHERE tsd.season_id = ${season || season_id.id} AND tsd.division_id = $1
            ORDER BY points desc, games_played asc, goals_for desc
            LIMIT 5;
        `;

        let standings = [];
        if (team.length > 0) {
            standings = await db.query(standingsQuery, [team[0].division_id]);
        }

        const teamPlayerStatsQuery = `
            SELECT p.first_name, p.last_name, p.id AS player_id, ps.* FROM players p
            JOIN player_team_season pt ON pt.player_id = p.id
            JOIN teams t ON t.id = pt.team_id
            JOIN player_stats ps ON ps.player_id = p.id
            WHERE t.id = $1 AND pt.season_id = ${season || season_id.id} AND ps.season_id = ${season || season_id.id}
            ORDER BY ps.points desc
        `;

        const teamPlayerStats = await db.query(teamPlayerStatsQuery, [id]);


        // TEAM LEADER QUERIES
        // should try to figure out how to make this one query instead of 5
        const teamLeaderPointsQuery = `
            select players.id AS player_id, first_name, last_name, points from player_stats
            join players on players.id = player_stats.player_id
            where team_id = $1 and season_id = ${season || season_id.id}
            order by points desc, goals asc limit 1;
        `;
        const teamLeaderPoints = await db.query(teamLeaderPointsQuery, [id]);

        const teamLeaderGoalsQuery = `
            select players.id AS player_id, first_name, last_name, goals as points from player_stats
            join players on players.id = player_stats.player_id
            where team_id = $1 and season_id = ${season || season_id.id}
            order by goals desc, points desc limit 1;
        `;
        const teamLeaderGoals = await db.query(teamLeaderGoalsQuery, [id]);

        const teamLeaderAssistsQuery = `
            select players.id AS player_id, first_name, last_name, assists as points from player_stats
            join players on players.id = player_stats.player_id
            where team_id = $1 and season_id = ${season || season_id.id}
            order by assists desc, points desc limit 1;
        `;
        const teamLeaderAssists = await db.query(teamLeaderAssistsQuery, [id]);

        const teamLeaderPIMSQuery = `
            select players.id AS player_id, first_name, last_name, penalties_in_minutes as points from player_stats
            join players on players.id = player_stats.player_id
            where team_id = $1 and season_id = ${season || season_id.id}
            order by penalties_in_minutes desc, points desc limit 1;
        `;
        const teamLeaderPIMS = await db.query(teamLeaderPIMSQuery, [id]);

        const teamLeaders = [];

        teamLeaders.push({ category: 'Points', ...teamLeaderPoints[0] });
        teamLeaders.push({ category: 'Goals', ...teamLeaderGoals[0] });
        teamLeaders.push({ category: 'Assists', ...teamLeaderAssists[0] });
        teamLeaders.push({ category: 'PIMs', ...teamLeaderPIMS[0] });

        // END TEAM LEADER QUERIES
        // should try to figure out how to make this one query instead of 5


        return res.send({ status: 200, data: { team: team[0], recent, record, seasons, standings, seasonsSelect, teamPlayerStats, teamLeaders }, message: 'Retrieved Team' });
    } catch (error) {
        console.log('GET TEAM BY ID ERROR: ', error);
        return next(error);
    }
};


const getTeamSchedule = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const { season } = req.query;
        let season_id;

        const confirmTeam = await db.teams.findOne({ id });
        if (!confirmTeam) {
            return res.send({ status: 404, data: [], message: 'Team cannot be found' });
        }

        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        const scheduleQuery = `
            SELECT g.id, g.start_date, g.home_score, g.away_score, g.has_been_played,
            h.name AS home_team, h.id AS home_team_id,
            a.name AS away_team, a.id AS away_team_id,
            locations.name AS location_name, locations.id AS location_id,
            seasons.name AS season_name, divisions.name AS division_name 
            FROM game_season_division gsd 
            JOIN games g ON g.id = gsd.game_id
            JOIN teams h ON h.id = g.home_team
            JOIN teams a ON a.id = g.away_team
            JOIN seasons ON seasons.id = gsd.season_id
            JOIN divisions ON divisions.id = gsd.division_id
            JOIN locations ON locations.id = g.location_id
            WHERE gsd.season_id = ${season || season_id.id} AND (h.id = $1 OR a.id = $1) 
            ORDER BY g.start_date;
        `;

        const schedule = await db.query(scheduleQuery, [id]);
        return res.send({ status: 200, data: schedule, message: 'Retrieved Team' });
    } catch (error) {
        console.log('GET TEAM SCHEDULE ERROR: ', error);
        return next(error);
    }
};


const getStandings = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { season, division } = req.query;
        let season_id;
        if (!season || season === 'undefined') {
            season_id = await db.seasons.findOne({ is_active: true });
        }

        let query = `
            SELECT 
            d.name AS division_name, jsonb_agg(jsonb_build_object(
                'name', t.name, 'id', t.id, 'games_played', tsd.games_played, 'wins', tsd.wins, 'losses', tsd.losses, 'points', tsd.points, 'goals_for', tsd.goals_for, 'goals_against', tsd.goals_against, 'penalties_in_minutes', tsd.penalties_in_minutes
            ) ORDER BY tsd.points desc, games_played asc, goals_for desc) AS teams_in_division 
            FROM team_season_division tsd
            INNER join teams t ON t.id = tsd.team_id
            INNER join divisions d ON d.id = tsd.division_id
            WHERE tsd.season_id = ${season || season_id.id}
        `;

        if (division) {
            query += 'AND division_id = $1';
        }

        query += 'GROUP BY d.id, d.name ORDER BY d.name;';

        const data = await db.query(query, [division]);
        return res.send({ status: 200, data: { standings: data, season: season || season_id.id }, message: 'Retrieved standings' });
    } catch (error) {
        console.log('GET STANDINGS ERROR: ', error);
        return next(error);
    }
};


const createTeam = async (req, res, next) => {
    try {
        const db = app.get('db');

        const { name, division_id, season_name, colors } = req.body;
        const team = await db.teams.findOne({ name });

        if (team) {
            return res.send({ status: 400, data: [], message: 'team already exists' });
        }

        const season = await db.seasons.findOne({ name: season_name });

        if (!season) {
            return res.send({ status: 400, data: [], message: 'season does not exist' });
        }

        const data = await db.teams.insert({ name, colors, created_at: new Date(), created_by: req.user.id });
        await db.team_season_division.insert({ team_id: data.id, season_id: season.id, division_id });
        return res.send({ status: 200, data, message: 'Team created' });
    } catch (error) {
        console.log('CREATE TEAM ERROR: ', error);
        return next(error);
    }
};

const updateTeam = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { name, division_id, colors, season_name } = req.body;
        const { id } = req.params;

        const team = await db.teams.findOne({ id });
        if (!team) {
            return res.send({ status: 404, error: true, message: 'Team not found' });
        }

        const season = await db.seasons.findOne({ name: season_name });
        const updatedTeam = await db.teams.update({ id }, { name, colors: JSON.stringify(colors), updated_at: new Date(), updated_by: req.user.id });
        await db.team_season_division.update({ season_id: season.id, team_id: id }, { division_id });
        return res.send({ status: 200, data: updatedTeam, message: 'Team updated' });
    } catch (error) {
        console.log('UPDATE TEAM ERROR: ', error);
        return next(error);
    }
};

const deleteTeam = async (req, res, next) => {
    try {
        const db = app.get('db');
        const { id } = req.params;
        const { season_id, division_id } = req.body;

        console.log(req.body, 'BODY IN DELETE');

        const team = await db.teams.findOne({ id });
        if (!team) {
            return res.send({ status: 404, error: true, message: 'Team not found' });
        }

        // const teamHasGames = await db.query(`
        //     select * from game_season_division gsd
        //     join games on games.id = gsd.game_id
        //     join teams h on h.id = games.home_team
        //     join teams a on a.id = games.away_team
        //     where gsd.season_id = $1 AND (h.id = $2 OR a.id = $2);
        //     `, [season_id, id]);

        // if(teamHasGames.length > 0) {
        //     console.log('this team has at least one game')
        // }

        // const data = await db.teams.update({ id }, { deleted_at: new Date(), deleted_by: req.user.id })
        await db.team_season_division.destroy({ team_id: id, season_id, division_id });
        return res.send({ status: 200, data: req.body, message: 'Team deleted from season' });
        // if there's no games (and future no players), should we just delete the whole record instead of marking as deleted?
        // const data = await db.teams.destroy({ id })
        // const data = await db.teams.update({ id }, { deleted_at: new Date(), deleted_by: req.user.id })
        // return res.send({ status: 200, data, message: 'Team deleted' })
    } catch (error) {
        console.log('DELETE TEAM ERROR: ', error);
        return next(error);
    }
};


module.exports = {
    getAllTeams,
    getAllTeamsByDivision,
    getTeamById,
    getTeamSchedule,
    getStandings,
    createTeam,
    updateTeam,
    deleteTeam,
};
