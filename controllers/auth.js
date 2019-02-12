const app = require('../server.js');

const login = async (req, res) => {
    console.log('============================')
    const db = app.get('db');

    const { email, password, password_confirmation } = req.body;

    if (password !== password_confirmation) {
        return res.status(400).send({ error: 400, message: 'Passwords must match' })
    }

    const user = await db.users.findOne({ email }).catch(err => console.log(err, 'errorrrrr in login'));
    // console.log(user, 'data!')

    if (!user) {
        return res.status(400).send({ error: 400, message: 'Incorrect email or password' })
    }

    const pass = await db.passwords.findOne({ user_id: user.id });
    // console.log(pass, 'pass!')

    if (pass.pw !== password) {
        return res.status(400).send({ error: 400, message: 'Incorrect email or password' })
    }


    return res.status(200).send({status: 200, data: user, message: 'You have successfully logged in'})

}



module.exports = {
    login
}