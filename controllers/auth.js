const app = require('../server.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authorizeAccessToken = async (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err || !user){
            return res.status(401).send({status: 401, error: true, message: err || "Unauthorized"})
        }
        req.user = user;
        return next();
    })(req, res, next)
}


const login = async (req, res) => {
    passport.authenticate('local-login', async (err, user, info) => {
        if(err || !user){
            console.log(err, user, info)
            return res.status(404).send({status: 404, error: true, message: err || 'Incorrect email or password.'})
        }

        req.login(user, { session: false }, async (errr) => {
            if(errr){
                console.log(errr, 'errr')
                return res.status(500).send({status: 500, error: true, message:  `An error occurred: ${errr}`})
            }
            const token = jwt.sign({user}, 'top_secret')
            res.status(200).send({status: 200, data: user, token, message: 'Welcome! You"re logged in!'})
        })
    })(req, res)
}


const signup = async (req, res) => {
    passport.authenticate('local-signup', async (err, user, info) => {
        console.log(err, user, info, 'ha!')
        if(err || !user){
            console.log(err, user, info)
            return res.status(400).send({status: 400, error: true, message: err || info.message})
        }

        return res.status(200).send({status: 200, data: user, message: 'You have successfully created an account.'})
    })(req, res)
}





module.exports = {
    authorizeAccessToken,
    login, 
    signup
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

    if(!user){
        return done(null, false, {message: 'USER NOT FOUND'})
    }
    const pw = await db.passwords.findOne({user_id: user.id})


    const comparedPassword = await bcrypt.compare(password, pw.pw)
    console.log(comparedPassword)

    if(!comparedPassword){
        return done(null, false, {message: "PASSWORD WRONGGGG"})
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

    if(user){
        return done(null, false, {message: 'Email being used. Please sign in.'})
    }

    const { first_name, last_name, is_admin, password_confirmation } = req.body;

    if (password !== password_confirmation) {
        return done(null, false, {message: "Passwords must match."})
    }

    const newUser = await db.users.insert({first_name, last_name, is_admin, email});

    const hash = await bcrypt.hash(password, 10);

    await db.passwords.insert({user_id: newUser.id, pw: hash})

    return done(null, newUser)


}))


////////////////// JWT //////////////////

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('jwt', new JWTStrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    console.log(token, 'TOKEN!!!!!!!!')
    try {
        return done(null, token.user)
    }
    catch (err) {
        console.log(err, 'catch!')
    }
}))