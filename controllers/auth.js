const app = require('../server.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailer = require('./helpers/emailer');

let config;
if(process.env.NODE_ENV !== 'production') {
    config = require('../config');
}

const JWTSECRET = process.env.JWTSECRET || config.JWTSECRET;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const authorizeAccessToken2 = (roles) => async (req, res, next) => {
    console.log(roles, 'authoriszeaccestoken! 🌟🌟🌟🌟🌟')
    req.roles = roles;
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(200).send({ status: info.status || 401, error: true, message: info.message || "Unauthorized", ...info });
        }
        req.user = user;
        console.log(req.user, 'USER!')
        // return next();
    })(req, res, next)
}

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
        const season = await db.seasons.findOne({is_active: true});

        // NEED TO CHANGE THIS TO BE OPTIMIZED
        const seasons = await db.seasons.find({"deleted_date =": null}).catch(err => console.log(err));
        // NEED TO CHANGE THIS TO BE OPTIMIZED

        await db.users.update({id: user.id}, {last_login: new Date()}).catch(err => console.log(err, 'update last_login error on cookie login'))

        res.status(200).send({ status: 200, data: { user, season, seasons }, message: 'Welcome back! You\'re logged in on refresh!' });
    })(req, res)
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const login = async (req, res) => {
    const db = app.get('db');
    passport.authenticate('local-login', async (err, user, info) => {
        if (err || !user) {
            return res.status(200).send({ status: info.status || 404, error: true, message: info.message || 'Incorrect email or password.', snack: true })
        }

        req.login(user, { session: false }, async (errr) => {
            if (errr) {
                console.log(errr, 'errr')
                return res.status(500).send({ status: 500, error: true, message: `An error occurred: ${errr}` })
            }
            
            const season = await db.seasons.findOne({is_active: true});
            await db.users.update({id: user.id}, {last_login: new Date()}).catch(err => console.log(err, 'update last_login error on LOCAL login'))
            const access_token = jwt.sign({ user, season }, JWTSECRET)
            res.status(200).send({ status: 200, data: { user, season, access_token }, message: 'Welcome! You\'re logged in!' })
        })
    })(req, res);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const signup = async (req, res) => {
    passport.authenticate('local-signup', async (err, user, info) => {
        if (err || !user) {
            console.log(err, user, info)
            return res.status(400).send({ status: 400, error: true, message: err || info.message })
        }
        return res.status(200).send({ status: 200, data: user, message: 'You have successfully created an account.' })
    })(req, res);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const invite = async (req, res) => {
    const db = app.get('db');
    const { email, first_name, last_name, user_role } = req.body;

    console.log(req.user, 'req.user') // need to hook up to  auth.authorizeAccessToken, middleware to work

    const user = await db.users.findOne({ email });

    if (!!user) {
        if (!!user.invite_token) {
            return res.status(200).send({ status: 400, error: true, message: 'An invite for this user has already been sent out. Please reinvite user' })
        }
        return res.status(200).send({ status: 400, error: true, message: 'A user with this account email already exists' })
    }

    // set invite token with expiry
    const invite_token = jwt.sign({ email, first_name, last_name, user_role }, JWTSECRET, { expiresIn: '8h' })
    // add user by email / add user names / add invite_token
    const newUser = await db.users.insert({ email, first_name, last_name, admin_type: user_role, invite_token, invite_date: new Date() })
    // send email 
    await emailer.sendmail({ template: 'inviteUser', data: { email, first_name, last_name, user_role, invite_token } });
    // await for response
    return res.status(200).send({ status: 200, data: { ...newUser, full_name: `${first_name} ${last_name}`, status: 'invited' }, message: 'An invitation has been sent',  snack: true })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const registerFromInvite = async (req, res) => {
    const db = app.get('db');
    const { first_name, last_name, password } = req.body;

    const { token: invite_token } = req.query;
    const decodedToken = jwt.decode(invite_token);

    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        // token expired, possibly resend email with new token here
        return res.status(200).send({ status: 400, error: true, message: 'Registration code has expired. Please contact your administrator for a new registration code.', snack: true })
    }

    // check for matching token
    const user = await db.users.findOne({ invite_token });

    if (!user) {
        return res.status(200).send({ status: 400, error: true, message: 'Registration code invalid. Please contact your administrator for a new registration code.', snack: true })
    }

    // confirm user has not already registered
        // (check to see if password exists)
    // store password
    const hash = await bcrypt.hash(password, 10);
    await db.passwords.insert({ user_id: user.id, pw: hash });
    // remove token
    await db.users.update({ id: user.id }, { invite_token: null }).catch(err => console.log(err, 'remove invite_token error'))

    return res.status(200).send({ status: 200, data: [], redirect: `/login?email=${user.email}`, message: 'Account created, you can now log in', snack: true, })
}
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const resendInvite = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const user = await db.users.findOne({ id });
    if (!user) {
        return res.status(400).send({ status: 400, error: true, message: 'User does not exist.', snack: true })
    }
    // set invite token with expiry
    const invite_token = jwt.sign({ email: user.email, first_name: user.first_name, last_name: user.last_name }, JWTSECRET, { expiresIn: '8h' })
    // update invite_token
    // update reinvite_date
    await db.users.update({ id }, { invite_token, reinvite_date: new Date(), invite_date: null })
    // send email 
    const { email, first_name, last_name, admin_type } = user;

    const sendingMail = true // await emailer.sendmail({ template: 'inviteUser', data: { email, first_name, last_name, user_role: admin_type, invite_token } });
    const message = !!sendingMail ? 'An invitation has been re-sent' : 'Could not send re-invte email, please try again later';
    // await for response

    /// need to fix this response if error, possibly use try catch
    return res.status(200).send({ status: 200, data: { reinvited: true }, message, snack: true })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const sendResetPassword = async (req, res) => {
    const db = app.get('db');
    const { email } = req.body;

    // should switch this to use a reset_passowrd_token instead of invite_token
    const user = await db.users.findOne({ email });

    if (!user) {
        // may not want to send this message string
        return res.status(200).send({ status: 400, error: true, message: 'Email does not exist', snack: true })
    }

    const invite_token = jwt.sign({ email }, JWTSECRET, { expiresIn: '8h' })

    await db.users.update({ id: user.id }, { invite_token })

    const sendingMail = await emailer.sendmail({ template: 'resetPassword', data: { email, first_name: user.first_name, invite_token } });

    if (!sendingMail) {
        return res.status(200).send({ status: 400, error: true, message: 'Could not send reset password email, please try again later', snack: true })
    }

    return res.status(200).send({ status: 200, data: { resetSent: true }, message: 'A reset password link has been sent' })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updatePassword = async (req, res) => {
    const db = app.get('db');
    const { email, password, password_confirmation } = req.body;
    const { token: invite_token } = req.params;

    if (password !== password_confirmation) {
        return res.status(200).send({ status: 400, error: true, message: 'Passwords must match.', snack: true })
    }

    const decodedToken = jwt.decode(invite_token);

    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        // token expired, possibly resend email with new token here
        return res.status(200).send({ status: 400, error: true, message: 'Reset password code has expired. Please reset password again.', snack: true })
    }

    // check for matching token
    const user = await db.users.findOne({ invite_token });

    if (!user) {
        return res.status(200).send({ status: 400, error: true, message: 'Reset password code has expired. Please reset password again.', snack: true })
    }

    // store password
    const hash = await bcrypt.hash(password, 10);
    await db.passwords.update({ user_id: user.id }, { pw: hash })
    // remove token
    await db.users.update({ id: user.id }, { invite_token: null }).catch(err => console.log(err, 'remove invite_token error'))

    return res.status(200).send({ status: 200, data: [], message: 'Password reset', redirect: '/login', snack: true  })
}

module.exports = {
    authorizeAccessToken,
    authorizeAccessToken2,
    login,
    signup,
    invite,
    registerFromInvite,
    resendInvite,
    loginFromCookie,
    sendResetPassword,
    updatePassword,
}


// Passport

////////////////// LOGIN //////////////////

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //F ind the user asssociated with the email provided
    const db = app.get('db');
    const user = await db.users.findOne({ email })
    if (!user) {
        return done(null, false, { message: 'Incorrect email or password', internal_message: 'USER_NOT_FOUND' })
    }

    if (user.is_suspended){
        // return done(null, false, { message: 'User has been suspended', internal_message: 'USER_SUSPENDED' })
        return done(null, false, { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', internal_message: 'USER_SUSPENDED' })
    }

    if (user.reinvite_date) {
        await db.users.update({ id: user.id }, { reinvite_date: null }).catch(err => console.log(err, 'update local-login error on sign in'))
    }

    console.log(user, 'user')

    const pw = await db.passwords.findOne({ user_id: user.id })
    const comparedPassword = await bcrypt.compare(password, pw.pw)

    if (!comparedPassword) {
        return done(null, false, { message: 'Invalid password.' })
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
    secretOrKey: JWTSECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
}, async(req, token, done) => {
    // console.log(req.roles, 'req.roles in JWT')
    // console.log(token.user, 'token.user in JWT')
    try {
        // console.log(req.roles && req.roles.includes(token.user.admin_type), 'INCLUDEZZ');

        // if list of roles exists, check to see if the current user's admin_type is in the roles list
        if (req.roles && !req.roles.includes(token.user.admin_type)) {
            console.log("DOES NOT ROLSE")
            // return done(null, false, {message: 'Cant access this route because you must be one of ' + req.roles})
            return done(null, false, {message: 'You do not have permission for this action', redirect: '/dashboard', snack: true });
        }

        const isSuspended = await checkSuspended(token.user.id);
        if (!!isSuspended) {
            return done(null, false, isSuspended);
        }
        // console.log('yo')
        return done(null, token.user);
    }
    catch (err) {
        console.log(err, 'catch!');
    }
}))


// this fires on every admin request - too much?
const checkSuspended = async (id) => {
    const db = app.get('db');
    const user = await db.users.findOne({ id });
    if(!user){
        return { status: 404, message: 'User could not be found', shouldLogOut: true };
    }
    if(user.is_suspended){
        // return { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', shouldLogOut: true };
        return { status: 401, message: 'Your account has been disabled. Please contact the league administrator.' };
    }
    return false;
}