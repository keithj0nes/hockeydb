const app = require('../server.js');
var dateFormat = require('date-fns/format')


// ⭐️  Players ⭐️
const createPlayer = async (req, res) => {

    console.log('hitting!')
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;

    const player = await db.players.findOne({ email }).catch(err => console.log(err, 'error'));
    console.log(player, 'player!')


    if (player) {
        return res.status(400).send({ status: 400, error: true, message: 'Player already exists' })
    }

    const createdPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: req.user.id });
    const createdStats = await db.player_stats.insert({ player_id: createdPlayer.id, team_id: null, season: null, games_played: 0, goals: 0, assists: 0, points: 0, penalties_in_minutes: 0, game_winning_goals: 0, power_play_goals: 0, short_handed_goals: 0, goals_per_game: 0, assists_per_game: 0, points_per_game: 0 })
    console.log('saved players and stats');

    const data = { ...createdStats, ...createdPlayer }
    return res.status(200).send({ status: 200, data, message: 'Player created' })

}



const updatePlayer = async (req, res) => {
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;
    const { id } = req.params;
    const player = await db.players.findOne({ id }).catch(err => console.log(err));
    if (!player) {
        return res.status(404).send({ status: 404, error: true, message: 'Player not found' })
    }
    const data = await db.players.update({ id }, { first_name, last_name, email, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update player error'));


    return res.status(200).send({ status: 200, data, message: 'Player updated' });

}


const deletePlayer = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const player = await db.players.findOne({ id }).catch(err => console.log(err));

    if (!player) {
        return res.status(404).send({ status: 404, error: true, message: 'Player not found' })
    }

    const data = await db.players.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete player error'))

    return res.status(200).send({ status: 200, data, message: 'Player deleted' })

}




// ⭐️  Team ⭐️

const createTeam = async (req, res) => {
    const db = app.get('db')

    const { name, division_id, season_name, colors } = req.body;
    const team = await db.teams.findOne({ name }).catch(err => console.log(err, 'error'));

    if (team) {
        return res.status(200).send({ status: 400, data: [], message: 'team already exists' });
    }

    const season = await db.seasons.findOne({ name: season_name }).catch(err => console.log(err, 'error in createTeam season'));

    if(!season) {
        return res.status(200).send({ status: 400, data: [], message: 'season does not exist' });
    }

    const data = await db.teams.insert({ name, colors, created_date: new Date(), created_by: req.user.id });
    await db.team_season_division.insert({team_id: data.id, season_id: season.id, division_id});
    return res.status(200).send({ status: 200, data, message: 'Team created' });


}

const updateTeam = async (req, res) => {
    const db = app.get('db');
    const { name, division_id, colors, season_name } = req.body;
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(200).send({ status: 404, error: true, message: 'Team not found' })
    }

    const season = await db.seasons.findOne({ name: season_name }).catch(err => console.log(err, 'error in season updateTeam'));
    const updatedTeam = await db.teams.update({ id }, { name, colors, updated_date: new Date(), updated_by: req.user.id });
    await db.team_season_division.update({ season_id: season.id, team_id: id }, { division_id });
    return res.status(200).send({ status: 200, data: updatedTeam, message: 'Team updated' });
}

const deleteTeam = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const { season_id, division_id } = req.body;

    console.log(req.body, 'BODY IN DELETE')

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'Team not found' })
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
    
    // const data = await db.teams.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'error'))
    await db.team_season_division.destroy({team_id: id, season_id, division_id}).catch(err => console.log(err, 'error in TSD delete'));
    return res.status(200).send({ status: 200, data: req.body, message: 'Team deleted from season' })
    // if there's no games (and future no players), should we just delete the whole record instead of marking as deleted?
    // const data = await db.teams.destroy({ id }).catch(err => console.log(err, 'error'))
    // const data = await db.teams.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'error'))
    // return res.status(200).send({ status: 200, data, message: 'Team deleted' })

}


// ⭐️  News ⭐️

const createNews = async (req, res) => {
    const db = app.get('db');
    const { title, body, tags_in_post } = req.body;

    if (!title || !body) return res.status(200).send({ status: 404, error: true, message: 'Title and body are required', snack: true });

    const currentDate = dateFormat(new Date(), 'MM/DD/YYYY hh:mm:ss');
    const updateOrderQuery = `
        UPDATE news 
        SET display_order = (display_order + 1)
        WHERE display_order >= 1;
    `;
    await db.query(updateOrderQuery);

    const inserted = await db.news.insert({ title, display_order: 1, body, created_date: currentDate, created_by: (req.user && req.user.id) || 1}).catch(err => console.log(err, 'create news error'))

    if (!!tags_in_post.length) {
        const tagsInPost = tags_in_post.map(item => {
            return { news_id: inserted.id, tag_id: item.id };
        })
        await db.news_tags.insert(tagsInPost);
    }

    const { id: user_id, first_name, last_name } = req.user;
    const data = { ...inserted, user_id, first_name, last_name };
 
    return res.status(200).send({ status: 200, data, message: 'News post created', snack: true })
}


const updateNews = async (req, res) => {
    const db = app.get('db');

    const { title, body, allow_collapse, tag, fromIndex, toIndex, move, tags_in_post, is_hidden } = req.body;
    const { id } = req.params;

    const newsPost = await db.news.findOne({ id }).catch(err => console.log(err));

    if (!newsPost) {
        return res.status(200).send({ status: 404, error: true, message: 'News post not found', snack: true })
    }

    // if updating news post order
    if( !!move ) {
        if(move === 'down') {
            const query = `UPDATE news SET display_order = (display_order - 1)
                           WHERE display_order > $1 
                           AND display_order <= $2`;
            
            const updateDown = await db.query(query, [fromIndex, toIndex]);
            console.log(updateDown, 'UPDATE DOWN!')
        }
    
        if(move === 'up') {
            const query = `UPDATE news SET display_order = (display_order + 1)
                           WHERE display_order >= $1 
                           AND display_order < $2`;
    
            const updateUp = await db.query(query, [toIndex, fromIndex]);
            console.log(updateUp, 'UPDATE UP!')
        }    
        const updateMove = await db.news.update({ id }, { display_order: toIndex }).catch(err => console.log(err, 'update blog error'));

        return res.status(200).send({ status: 200, data: updateMove, message: 'News post order updated'})
    }

    // Manage hidden request
    console.log(req.body,' req.body admin update news post')
    if (req.body.hasOwnProperty('is_hidden')) {
        // const season = await db.seasons.findOne({ id }).catch(err => console.log(err));
        const data = await db.news.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden season error'))
        console.log(data, 'NOT HIDING NAYMORE data')
        return res.status(200).send({ status: 200, data: {...data[0], is_hidden}, message: is_hidden ? 'News post hidden' : 'News post unhidden', snack: true })
    }
    

    if (!!tags_in_post.length) {
        await db.news_tags.destroy({ news_id: id });
        const tagsInPost = tags_in_post.map(item => {
            return { news_id: id, tag_id: item.id };
        })
        await db.news_tags.insert(tagsInPost);
    }

    const data = await db.news.update({ id }, { title, body, allow_collapse, tag, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update blog error'))
    return res.status(200).send({ status: 200, data: data[0], message: 'News post updated', snack: true })
}

const deleteNews = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const newsPost = await db.news.findOne({ id }).catch(err => console.log(err));

    if (!newsPost) {
        return res.status(200).send({ status: 404, error: true, message: 'News post not found', snack: true })
    }

    const data = await db.news.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete news post error'))
    return res.status(200).send({ status: 200, data: data[0], message: 'News post deleted', snack: true })
}


// ⭐️  Season ⭐️


const createSeason = async (req, res) => {
    const db = app.get('db');

    const { name, type } = req.body;

    const season = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));

    if (season.length > 0) {
        console.log(season[0], 'season exists!')
        return res.status(200).send({ status: 400, data: [], message: 'Season already exists' })
    }

    const data = await db.seasons.insert({ name, type, is_active: false, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create blog error'))

    return res.status(200).send({ status: 200, data, message: 'Season created', snack: true })
}


const updateSeason = async (req, res) => {
    const db = app.get('db');

    const { type, name, is_active, is_hidden } = req.body;

    console.log(req.body, 'updateSeason BODY')
    const { id } = req.params;
    
    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(200).send({ status: 404, error: true, message: 'Season not found', snack: true })
    }
    
    // Manage hidden request
    if(req.body.hasOwnProperty('is_hidden')){
        // const season = await db.seasons.findOne({ id }).catch(err => console.log(err));
        if(season.is_active) {
            return res.status(200).send({ status: 409, data: [], message: 'Cannot hide the currently active season', snack: true })
        }
        const data = await db.seasons.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden season error'))
        console.log(data, 'NOT HIDING NAYMORE data')
        return res.status(200).send({ status: 200, data: {...data[0], is_hidden}, message: is_hidden ? 'Season hidden' : 'Season unhidden', snack: true })
    }

    // const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    // if (!season) {
    //     return res.status(200).send({ status: 404, error: true, message: 'Season not found', snack: true })
    // }
    
    if (name) {
        const nameExists = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
    
        if(nameExists.length > 0 && (nameExists[0].id !== season.id )){
            return res.status(200).send({ status: 409, data: [], message: 'Season already exists' })
        }
    }
    

    if (is_active){
        //search current is_active seasons -> set to false
        //set a flag to change global active season
        const findIsActive = await db.seasons.findOne({is_active}).catch(err => console.log(err, 'err in is_active'));
        await db.seasons.update({ id: findIsActive.id }, {is_active: false}).catch(err => console.log(err, 'updatedIsActive error'))
    }

    const data = await db.seasons.update({ id }, { name, type, is_active, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update season error'))
    return res.status(200).send({ status: 200, data: {...data[0], updateCurrentSeasonGlobally: is_active}, message: 'Season updated', snack: true })
}


const deleteSeason = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(404).send({ status: 404, error: true, message: 'Season not found', snack: true })
    }

    if(season.is_active) {
        return res.status(200).send({ status: 409, error: true, message: 'Cannot delete the currently active season', snack: true })
    }

    const data = await db.seasons.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete season error'))
    return res.status(200).send({ status: 200, data, message: 'Season deleted', snack: true })
}


// ⭐️  Division ⭐️


const createDivision = async (req, res) => {
    const db = app.get('db');

    const { name, season } = req.body;

    console.log(req.body, 'BODY')
    // const seasonName = season_name.replace(/season_/g, '')

    const season_id = await db.seasons.findOne({name: season});

    // const division = await db.divisions.findOne({ name, season_id }).catch(err => console.log(err, 'error in create season'));
    const division = await db.divisions.where('lower(name) = $1 AND season_id = $2', [name.toLowerCase(), season_id.id]).catch(err => console.log(err, 'error in crete division'));

    // console.log(division, 'DIVISION! 🐶')
    if (division.length > 0) {
        // console.log('DIVISION EXISTSSSS')
        return res.status(200).send({ status: 400, error: true, message: 'Division under this season already exists' })
    }

    const data = await db.divisions.insert({ name, season_id: season_id.id, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create division error'))

    return res.status(200).send({ status: 200, data, message: 'Division created', snack: true })
}


const updateDivision = async (req, res) => {
    const db = app.get('db');

    const { name, is_hidden } = req.body;
    const { id } = req.params;
    
    const division = await db.divisions.findOne({ id }).catch(err => console.log(err));
    
    if (!division) {
        return res.status(200).send({ status: 404, error: true, message: 'Division not found', snack: true })
    }
        // Manage hidden request
    if(req.body.hasOwnProperty('is_hidden')){
        const data = await db.divisions.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: req.user.id } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update is_hidden division error'))
        return res.status(200).send({ status: 200, data: data, message: is_hidden ? 'Division hidden' : 'Division unhidden', snack: true })
    }
    
    if(name) {
        // need to allow name exists so long as it's from a different season - can have the same division names between seasons
        const nameExists = await db.divisions.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
        if(nameExists.length > 0 && (nameExists[0].id !== division.id )){
            return res.status(200).send({ status: 409, data: [], message: 'Division already exists' })
        }
    }

    const data = await db.divisions.update({ id }, { name, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update Division error'))
    return res.status(200).send({ status: 200, data: data[0], message: 'Division updated', snack: true })
}

const deleteDivision = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const division = await db.divisions.findOne({ id }).catch(err => console.log(err));

    if (!division) {
        return res.status(200).send({ status: 404, error: true, message: 'Division not found', snack: true })
    }

    const divisionHasTeams = await db.team_season_division.findOne({division_id: division.id});
    if(divisionHasTeams){
        return res.status(200).send({ status: 409, error: true, message: 'Division cannot be deleted, there are teams in this division' })
    }

    const data = await db.divisions.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete Division error'))

    return res.status(200).send({ status: 200, data, message: 'Division deleted', snack: true })
}


// ⭐️  Locations ⭐️


const createLocation = async (req, res) => {
    const db = app.get('db');
    const { name, address } = req.body;

    const location = await db.locations.where('lower(name) = $1 AND deleted_date IS null', [name.toLowerCase()]).catch(err => console.log(err));

    if (!!location.length) {
        return res.status(200).send({ status: 400, error: true, message: 'Location already exists' })
    }

    const data = await db.locations.insert({ name, address, created_date: new Date(), created_by: req.user.id }).catch(err => console.log(err, 'create location error'))
    return res.status(200).send({ status: 200, data, message: 'Location created', snack: true })
}

const updateLocation = async (req, res) => {
    const db = app.get('db');

    const { name, address } = req.body;
    const { id } = req.params;

    const location = await db.locations.findOne({ id }).catch(err => console.log(err));

    if (!location) {
        return res.status(404).send({ status: 404, error: true, message: 'Location not found', snack: true })
    }

    if (name) {
        const nameExists = await db.locations.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
        if (nameExists.length > 0 && (nameExists[0].id !== location.id)) {
            return res.status(200).send({ status: 409, data: [], message: 'Location already exists' })
        }
    }

    const data = await db.locations.update({ id }, { name, address, updated_date: new Date(), updated_by: req.user.id }).catch(err => console.log(err, 'update location error'))
    return res.status(200).send({ status: 200, data: data[0], message: 'Location updated', snack: true })
}

const deleteLocation = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const location = await db.locations.findOne({ id }).catch(err => console.log(err));

    if (!location) {
        return res.status(404).send({ status: 404, error: true, message: 'Location not found', snack: true })
    }

    const data = await db.locations.update({ id }, { deleted_date: new Date(), deleted_by: req.user.id }).catch(err => console.log(err, 'delete location error'))
    return res.status(200).send({ status: 200, data: data[0], message: 'Location deleted', snack: true })
}


// ⭐️  Games ⭐️


const createGame = async (req, res) => {
    console.log('creating game!!')
    const db = app.get('db');

    const { home_team, away_team, location_id, start_date, season_id } = req.body;

    // let outOfDivision = false;
    // if(home_team.division_id !== away_team.division_id) {
    //     outOfDivision = true;
    //     // if outofdivision is true, we need to add both divisions to the game_season_division's table
    // }

    // console.log(req.body, 'REQ DOT BODY')

    const game = await db.games.insert({ home_team:home_team.home_team, away_team:away_team.away_team, location_id, start_date, has_been_played: false }).catch(err => console.log(err, 'error in games insert'))
    await db.game_season_division.insert({ game_id: game.id, season_id, division_id: home_team.division_id}).catch(err => console.log(err, 'error in GSD insert'))

    // console.log(game, 'GAME!!!')

    return res.status(200).send({ status: 200, data: game, message: 'Game created', snack: true })

}





const getUsers = async (req, res) => {
    const db = app.get('db');  
    const data = await db.users.find();
    res.status(200).send({ status: 200, data, message: 'Retrieved list of Users' });
}

module.exports = {
    createPlayer,
    updatePlayer,
    deletePlayer,

    createTeam,
    updateTeam,
    deleteTeam,

    createNews,
    updateNews,
    deleteNews,

    createSeason,
    updateSeason,
    deleteSeason,

    createDivision,
    updateDivision,
    deleteDivision,

    createLocation,
    updateLocation,
    deleteLocation,

    createGame,
}