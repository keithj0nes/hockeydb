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

    const createdPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: 1 });
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
    const data = await db.players.update({ id }, { first_name, last_name, email, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update player error'));


    return res.status(200).send({ status: 200, data, message: 'Player updated' });

}


const deletePlayer = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const player = await db.players.findOne({ id }).catch(err => console.log(err));

    if (!player) {
        return res.status(404).send({ status: 404, error: true, message: 'Player not found' })
    }

    const data = await db.players.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete player error'))

    return res.status(200).send({ status: 200, data, message: 'Player deleted' })

}




// ⭐️  Team ⭐️

const createTeam = async (req, res) => {
    const db = app.get('db')


    const { name, division_id, colors } = req.body;
    const team = await db.teams.findOne({ name }).catch(err => console.log(err, 'error'));

    if (team) {
        return res.status(400).send({ status: 400, data: [], message: 'team already exists' });
    }

    const data = await db.teams.insert({ name, division_id, colors, created_date: new Date(), created_by: 1 });
    return res.status(200).send({ status: 200, data, message: 'Team created' });


}

const updateTeam = async (req, res) => {
    const db = app.get('db');
    const { name, division_id, colors } = req.body;
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'Team not found' })
    }
    const updatedTeam = await db.teams.update({ id }, { name, division_id, colors, next_game, previous_game, updated_date: new Date(), updated_by: 1 });
    return res.status(200).send({ status: 200, data: updatedTeam, message: 'Team updated' });
}

const deleteTeam = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'Team not found' })
    }
    // 🚨 🚨  not sure what deleted_by should be just copied how you had it in posts, not exactly sure how you want to delete teams
    const data = await db.teams.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'error'))
    return res.status(200).send({ status: 200, data, message: 'Team deleted' })
}





// ⭐️  Blog ⭐️

const createBlog = async (req, res) => {
    const db = app.get('db');

    const { message } = req.body;
    console.log(req.user, 'ussser');


    let currentDate = dateFormat(new Date(), 'MM/DD/YYYY hh:mm:ss');

    const data = await db.blog.insert({ message, created_date: currentDate, created_by: req.user.id }).catch(err => console.log(err, 'create blog error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post created' })
}


const updateBlog = async (req, res) => {
    const db = app.get('db');

    const { message } = req.body;
    const { id } = req.params;

    const blogPost = await db.blog.findOne({ id }).catch(err => console.log(err));

    if (!blogPost) {
        return res.status(404).send({ status: 404, error: true, message: 'Blog post not found' })
    }

    const data = await db.blog.update({ id }, { message, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update blog error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post updated' })

}

const deleteBlog = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const blogPost = await db.blog.findOne({ id }).catch(err => console.log(err));

    if (!blogPost) {
        return res.status(404).send({ status: 404, error: true, message: 'Blog post not found' })
    }

    const data = await db.blog.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete blog error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post deleted' })

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

    const data = await db.seasons.insert({ name, type, is_active: false, created_date: new Date(), created_by: 1 }).catch(err => console.log(err, 'create blog error'))

    return res.status(200).send({ status: 200, data, message: 'Season created' })
}


const updateSeason = async (req, res) => {
    const db = app.get('db');

    const { type, name, is_active, is_hidden } = req.body;

    console.log(req.body, 'updateSeason BODY')
    const { id } = req.params;
    
    if(req.body.hasOwnProperty('is_hidden')){
        const data = await db.seasons.update({ id }, is_hidden ? { hidden_date: new Date(), hidden_by: 1 } : { hidden_date: null, hidden_by: null }).catch(err => console.log(err, 'update season error'))
        console.log(data, 'NOT HIDING NAYMORE data')
        return res.status(200).send({ status: 200, data: [], message: is_hidden ? 'Season hidden' : 'Season unhidden' })
    }

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(200).send({ status: 404, error: true, message: 'Season not found' })
    }
    
    if(name) {
        const nameExists = await db.seasons.where('lower(name) = $1', [name.toLowerCase()]).catch(err => console.log(err));
    
        if(nameExists.length > 0 && (nameExists[0].id !== season.id )){
            return res.status(200).send({ status: 409, data: [], message: 'Season already exists' })
        }
    }
    

    if(is_active){
        //search current is_active seasons -> set to false
        //set a flag to change global active season
        const findIsActive = await db.seasons.findOne({is_active}).catch(err => console.log(err, 'err in is_active'));
        await db.seasons.update({ id: findIsActive.id }, {is_active: false}).catch(err => console.log(err, 'updatedIsActive error'))
    }

    const data = await db.seasons.update({ id }, { name, type, is_active, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update season error'))
    return res.status(200).send({ status: 200, data: {...data[0], updateCurrentSeasonGlobally: is_active}, message: 'Season updated' })
}


const deleteSeason = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(404).send({ status: 404, error: true, message: 'Season not found' })
    }

    const data = await db.seasons.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete season error'))

    return res.status(200).send({ status: 200, data, message: 'Season deleted' })

}


// ⭐️  Division ⭐️


const createDivision = async (req, res) => {
    const db = app.get('db');

    const { name, season_id } = req.body;

    // const division = await db.divisions.findOne({ name, season_id }).catch(err => console.log(err, 'error in create season'));
    const division = await db.divisions.where('lower(name) = $1 AND season_id = $2', [name.toLowerCase(), season_id]).catch(err => console.log(err, 'error in crete division'));

    // console.log(division, 'DIVISION! 🐶')
    if (division.length > 0) {
        // console.log('DIVISION EXISTSSSS')
        return res.status(200).send({ status: 400, error: true, message: 'Division under this season already exists' })
    }

    const data = await db.divisions.insert({ name, season_id, created_date: new Date(), created_by: 1 }).catch(err => console.log(err, 'create division error'))

    return res.status(200).send({ status: 200, data, message: 'Division created' })

}


const updateDivision = async (req, res) => {
    const db = app.get('db');

    const { type, name } = req.body;
    const { id } = req.params;

    const season = await db.divisions.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(404).send({ status: 404, error: true, message: 'Division not found' })
    }

    const data = await db.divisions.update({ id }, { name, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update Division error'))

    return res.status(200).send({ status: 200, data, message: 'Division updated' })

}

const deleteDivision = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const season = await db.divisions.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(404).send({ status: 404, error: true, message: 'Division not found' })
    }

    const data = await db.divisions.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete Division error'))

    return res.status(200).send({ status: 200, data, message: 'Division deleted' })

}



// ⭐️  Locations ⭐️


const createLocation = async (req, res) => {
    console.log('creating!')
    const db = app.get('db');

    const { name, address } = req.body;

    const location = await db.locations.findOne({ name }).catch(err => console.log(err, 'error in create season'));

    console.log(location, 'location!')
    if (location) {
        return res.status(400).send({ status: 400, error: true, message: 'Location already exists.' })
    }

    const data = await db.locations.insert({ name, address, created_date: new Date(), created_by: 1 }).catch(err => console.log(err, 'create location error'))

    return res.status(200).send({ status: 200, data, message: 'Location created' })

}


const updateLocation = async (req, res) => {
    const db = app.get('db');

    const { name, address } = req.body;
    const { id } = req.params;

    const location = await db.locations.findOne({ id }).catch(err => console.log(err));

    if (!location) {
        return res.status(404).send({ status: 404, error: true, message: 'Location not found' })
    }

    const data = await db.locations.update({ id }, { name, address, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update location error'))

    return res.status(200).send({ status: 200, data, message: 'Location updated' })

}

const deleteLocation = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const location = await db.locations.findOne({ id }).catch(err => console.log(err));

    if (!location) {
        return res.status(404).send({ status: 404, error: true, message: 'Location not found' })
    }

    const gameWithLocation = await db.games.findOne({location_id: location.id});

    if(gameWithLocation){
        return res.status(200).send({ status: 409, error: true, message: 'Location cannot be deleted, a game is using this location' })
    }

    const data = await db.locations.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete location error'))

    return res.status(200).send({ status: 200, data, message: 'Location deleted' })

}




module.exports = {
    createPlayer,
    updatePlayer,
    deletePlayer,

    createTeam,
    updateTeam,
    deleteTeam,

    createBlog,
    updateBlog,
    deleteBlog,

    createSeason,
    updateSeason,
    deleteSeason,

    createDivision,
    updateDivision,
    deleteDivision,

    createLocation,
    updateLocation,
    deleteLocation
}