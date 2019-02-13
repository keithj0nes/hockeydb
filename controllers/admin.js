const app = require('../server.js');


// ⭐️  Players ⭐️
const createPlayer = async (req, res) => {

    console.log('hitting!')
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;

    const player = await db.players.findOne({ email }).catch(err => console.log(err, 'error'));
    console.log(player, 'player!')

    if (!player) {
        const createdPlayer = await db.players.insert({ first_name: `${first_name}`, last_name: `${last_name}`, email: `${email}` });
        const createdStats = await db.player_stats.insert({ player_id: createdPlayer.id, team_id: null, season: null, games_played: null, goals: null, assists: null, points: null, penalties_in_minutes: null, game_winning_goals: null, power_play_goals: null, short_handed_goals: null, goals_per_game: null, assists_per_game: null, points_per_game: null })
        console.log('saved players and stats');

        const newPlayer = { ...createdStats, ...createdPlayer }
        return res.status(200).send({ status: 200, data: newPlayer, message: 'You have successfully created a player' })

    } else {
        console.log('player already exisits');
        return res.status(400).send({ status: 400, data: [], message: 'Player already exists' })
    }
}



const updatePlayer = async (req, res) => {
    const db = app.get('db');
    const { first_name, last_name, email } = req.body;
    const { id } = req.params;
    const player = await db.players.findOne({ id }).catch(err => console.log(err));
    if (!player) {
        return res.status(404).send({ status: 404, error: true, message: 'Player not found' })
    }
    const updatedPlayer = await db.players.update({ id }, { first_name, last_name, email });

    return res.status(200).send({ status: 200, data: updatedPlayer, message: 'player has been updated' });

}
// ⭐️  Team ⭐️
const createTeam = async (req, res) => {
    const db = app.get('db')
    const { team_name, team_division, team_colors, next_game, previous_game } = req.body;
    const team = await db.teams.findOne({ team_name }).catch(err => console.log(err, 'error'));
    if (!team) {
        const createdTeam = await db.teams.insert({ team_name: `${team_name}`, team_division: `${team_division}`, team_colors: `${team_colors}`, next_game: `${next_game}`, previous_game: `${previous_game}` });
        return res.status(200).send({ status: 200, data: createdTeam, message: 'You have successfully created a team' });
    } else {
        console.log('team already exisits');
        return res.status(400).send({ status: 400, data: [], message: 'team already exists' });
    }
}

const updateTeam = async (req, res) => {
    const db = app.get('db');
    const { team_name, team_division, team_colors, next_game, previous_game } = req.body;
    const { id } = req.params;

    const team = await db.teams.findOne({ id }).catch(err => console.log(err));
    if (!team) {
        return res.status(404).send({ status: 404, error: true, message: 'team not found' })
    }
    const updatedTeam = await db.teams.update({ id }, { team_name, team_division, team_colors, next_game, previous_game });
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

    const data = await db.blog.insert({ id }, { message, posted_date: new Date(), posted_by: 1 }).catch(err => console.log(err, 'create blog error'))

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

    const data = await db.blog.update({ id }, { message, updated_date: new Date(), posted_by: 1 }).catch(err => console.log(err, 'update blog error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post updated' })

}

const deleteBlog = async (req, res) => {
    const db = app.get('db');

    const { id } = req.params;

    const blogPost = await db.blog.findOne({ id }).catch(err => console.log(err));

    if (!blogPost) {
        return res.status(404).send({ status: 404, error: true, message: 'Blog post not found' })
    }

    const data = await db.blog.update({ id }, { deleted_date: new Date(), deleted_by: 1 }).catch(err => console.log(err, 'update blog error'))

    return res.status(200).send({ status: 200, data, message: 'Blog post deleted' })

}






module.exports = {
    createPlayer,
    updatePlayer,
    createTeam,
    updateTeam,
    deleteTeam,
    createBlog,
    updateBlog,
    deleteBlog
}