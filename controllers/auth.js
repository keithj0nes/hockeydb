const app = require('../server.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const config = require('../config');
let config;
if(process.env.NODE_ENV !== 'production') {
    config = require('../config');
}

const JWTSECRET = process.env.JWTSECRET || config.JWTSECRET;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const authorizeAccessToken = async (req, res, next) => {
    console.log('authoriszeaccestoken!')
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(200).send({ status: info.status || 401, error: true, message: info.message || "Unauthorized", ...info });
        }
        req.user = user;
        return next();
    })(req, res, next)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginFromCookie = async (req, res) => {
    const db = app.get('db');

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err || !user) {
            console.log(err, 'error in passport.authenticate jwt');
            return res.status(200).send({ status: info.status || 401, error: true, message: info.message || "Unauthorized" });
        }
        console.log('logged in from cookie');
        const season = await db.seasons.findOne({is_active: true});

        // NEED TO CHANGE THIS TO BE OPTIMIZED
        const seasons = await db.seasons.find({"deleted_date =": null}).catch(err => console.log(err));
        // NEED TO CHANGE THIS TO BE OPTIMIZED

        res.status(200).send({ status: 200, data: { user, season, seasons }, message: 'Welcome back! You\'re logged in on refresh!' });
    })(req, res)
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const login = async (req, res) => {
    const db = app.get('db');
    passport.authenticate('local-login', async (err, user, info) => {
        if (err || !user) {
            // console.log(err, user, info, 'error')
            // return res.status(404).send({status: 404, error: true, message: err || 'Incorrect email or password.'})
            return res.status(200).send({ status: info.status || 404, error: true, message: info.message || 'Incorrect email or password.' })

        }

        req.login(user, { session: false }, async (errr) => {
            if (errr) {
                console.log(errr, 'errr')
                return res.status(500).send({ status: 500, error: true, message: `An error occurred: ${errr}` })
            }
            // console.log('logging in user: ', user)
            console.log('logged in from sign in')

            const season = await db.seasons.findOne({is_active: true});

            // NEED TO CHANGE THIS TO BE OPTIMIZED
            const seasons = await db.seasons.find({"deleted_date =": null}).catch(err => console.log(err));
            // NEED TO CHANGE THIS TO BE OPTIMIZED

            // console.log(seasons, 'SEASON')
            const access_token = jwt.sign({ user, season, seasons }, config.JWTSECRET)
            res.status(200).send({ status: 200, data: { user, season, seasons, access_token }, message: 'Welcome! You\'re logged in!' })
        })
    })(req, res)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const signup = async (req, res) => {
    passport.authenticate('local-signup', async (err, user, info) => {
        console.log(err, user, info, 'ha!')
        if (err || !user) {
            console.log(err, user, info)
            return res.status(400).send({ status: 400, error: true, message: err || info.message })
        }

        return res.status(200).send({ status: 200, data: user, message: 'You have successfully created an account.' })
    })(req, res)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const invite = async (req, res) => {
    const { email, first_name, last_name } = req.body;

    const user = await db.users.findOne({ email });

    if (user) {
        return res.status(400).send({ status: 400, error: true, message: 'User exists.' })
    }

    //set invite token with expiry
    const invite_token = jwt.sign({ email, first_name, last_name }, config.JWTSECRET, { expiresIn: '8h' })
    //add user by email
    //add user names
    //add invite_token
    const newUser = await db.users.insert({ email, first_name, last_name, invite_token, invite_date: new Date() })
    //send email 
    //await for response
    return res.status(200).send({ status: 200, data: newUser, message: 'User has been invited.' })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const reinvite = async (req, res) => {

    const { id } = req.params;

    const user = await db.users.findOne({ id });

    if (!user) {
        return res.status(400).send({ status: 400, error: true, message: 'User does not exist.' })
    }

    //set invite token with expiry
    const invite_token = jwt.sign({ email: user.email, first_name: user.first_name, last_name: user.last_name }, config.JWTSECRET, { expiresIn: '8h' })
    //update invite_token
    //update reinvite_date
    const reInvitedUser = await db.users.update({ id }, { invite_token, reinvite_date: new Date() })
    //send email 
    //await for response
    return res.status(200).send({ status: 200, data: reInvitedUser, message: 'User has been reinvited.' })

}




module.exports = {
    authorizeAccessToken,
    login,
    signup,
    invite,
    reinvite,
    loginFromCookie
}




//Passport

////////////////// LOGIN //////////////////

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //Find the user asssociated with the email provided
    const db = app.get('db');

    const user = await db.users.findOne({ email })

    if (!user) {
        return done(null, false, { message: 'Incorrect email or password', internal_message: 'USER_NOT_FOUND' })
    }

    if(user.is_suspended){
        // return done(null, false, { message: 'User has been suspended', internal_message: 'USER_SUSPENDED' })
        return done(null, false, { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', internal_message: 'USER_SUSPENDED' })
    }

    const pw = await db.passwords.findOne({ user_id: user.id })

    const comparedPassword = await bcrypt.compare(password, pw.pw)

    if (!comparedPassword) {
        return done(null, false, { message: "PASSWORD WRONGGGG" })
    }

    return done(null, user)
}))


////////////////// SIGNUP //////////////////

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const db = app.get('db');

    const user = await db.users.findOne({ email })

    if (user) {
        return done(null, false, { message: 'Email being used. Please sign in.' })
    }

    const { first_name, last_name, is_admin, password_confirmation } = req.body;

    if (password !== password_confirmation) {
        return done(null, false, { message: "Passwords must match." })
    }

    const newUser = await db.users.insert({ first_name, last_name, is_admin, email });

    const hash = await bcrypt.hash(password, 10);

    await db.passwords.insert({ user_id: newUser.id, pw: hash })

    return done(null, newUser)


}))


////////////////// JWT //////////////////

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('jwt', new JWTStrategy({
    secretOrKey: config.JWTSECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    console.log(token.user, 'OKEN>USER')
    try {
        const isSuspended = await checkSuspended(token.user.id);
        if(!!isSuspended){
            console.log(isSuspended, 'issupsended')
            return done(null, false, isSuspended)
        }
        // console.log('yo')
        return done(null, token.user)
    }
    catch (err) {
        console.log(err, 'catch!')
    }
}))


const checkSuspended = async (id) => {
    const db = app.get('db');
    const user = await db.users.findOne({ id })
    if(!user){
        return { status: 404, message: 'User could not be found'}
    }
    if(user.is_suspended){
        return { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', shouldLogOut: true }
    }
    return false;
}