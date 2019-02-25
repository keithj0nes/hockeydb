const app = require('../server.js');


// ⭐️  Players ⭐️
const createPlayer = async (req, res) => {

    console.log('hitting!')
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;

    const player = await db.players.findOne({ email }).catch(err => console.log(err, 'error'));
    console.log(player, 'player!')


    if(player){
        return res.status(400).send({ status: 400, error: true, message: 'Player already exists' })
    }


    const createdPlayer = await db.players.insert({ first_name, last_name, email, created_date: new Date(), created_by: 1});
    const createdStats = await db.player_stats.insert({ player_id: createdPlayer.id, team_id: null, season: null, games_played: null, goals: null, assists: null, points: null, penalties_in_minutes: null, game_winning_goals: null, power_play_goals: null, short_handed_goals: null, goals_per_game: null, assists_per_game: null, points_per_game: null })
    console.log('saved players and stats');

    const data = { ...createdStats, ...createdPlayer }
    return res.status(200).send({ status: 200, data, message: 'Player player' })

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


    return res.status(200).send({ status: 200, data, message: 'player has been updated' });

}


const deletePlayer = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const player = await db.players.findOne({ id }).catch(err => console.log(err));

    if (!player) {
        return res.status(404).send({ status: 404, error: true, message: 'Player not found' })
    }

    const data = await db.players.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'delete player error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post deleted' })

}




// ⭐️  Team ⭐️

const createTeam = async (req, res) => {
    const db = app.get('db')
    const { team_name, team_division, team_colors, next_game, previous_game } = req.body;
    const team = await db.teams.findOne({ team_name }).catch(err => console.log(err, 'error'));

    if (team) {
        return res.status(400).send({ status: 400, data: [], message: 'team already exists' });
    }

    const data = await db.teams.insert({ team_name, team_division, team_colors, next_game, previous_game, created_date: new Date(), created_by: 1 });
    return res.status(200).send({ status: 200, data, message: 'You have successfully created a team' });


}

const updateTeam = async (req, res) => {
    const db = app.get('db');
    const { team_name, team_division, team_colors, next_game, previous_game } = req.body;
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'team not found' })
    }
    const updatedTeam = await db.teams.update({ id }, { team_name, team_division, team_colors, next_game, previous_game, updated_date: new Date(), updated_by: 1 });
    return res.status(200).send({ status: 200, data: updatedTeam, message: 'team has been updated' });
}

const deleteTeam = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'team not found' })
    }
    // 🚨 🚨  not sure what deleted_by should be just copied how you had it in posts, not exactly sure how you want to delete teams
    const data = await db.teams.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'error'))
    return res.status(200).send({ status: 200, data, message: 'team deleted' })
}





// ⭐️  Blog ⭐️

const createBlog = async (req, res) => {
    const db = app.get('db');

    const { message } = req.body;

    console.log('message', message)

    const data = await db.blog.insert({ message, posted_date: new Date(), posted_by: 1 }).catch(err => console.log(err, 'create blog error'))

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

    const season = await db.seasons.findOne({ name }).catch(err => console.log(err, 'error in create season'));

    if(season){
        return res.status(400).send({ status: 400, data: [], message: 'Season already exists' })        
    }

    const data = await db.seasons.insert({ name, type, created_date: new Date(), created_by: 1 }).catch(err => console.log(err, 'create blog error'))

    return res.status(200).send({ status: 200, data, message: 'Season created' })

}


const updateSeason = async (req, res) => {
    const db = app.get('db');

    const { type, name } = req.body;
    const { id } = req.params;

    const season = await db.seasons.findOne({ id }).catch(err => console.log(err));

    if (!season) {
        return res.status(404).send({ status: 404, error: true, message: 'Season not found' })
    }

    const data = await db.seasons.update({ id }, { name, type, updated_date: new Date(), updated_by: 1 }).catch(err => console.log(err, 'update season error'))

    return res.status(200).send({ status: 200, data, message: 'Season updated' })

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

    const { name } = req.body;

    const season = await db.divisions.findOne({ name }).catch(err => console.log(err, 'error in create season'));

    console.log(season, 'season!')
    if(season){
        return res.status(400).send({ status: 400, error: true, message: 'Division already exists' })        
    }

    const data = await db.divisions.insert({ name, created_date: new Date(), created_by: 1 }).catch(err => console.log(err, 'create division error'))

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
    deleteDivision
}