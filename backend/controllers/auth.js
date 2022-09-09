/* eslint-disable no-use-before-define */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const app = require('../server.js');
const emailer = require('./helpers/emailer');


const { JWT_SECRET } = process.env;

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const authorizeAccessToken2 = (roles) => async (req, res, next) => {
    console.log(roles, 'authoriszeaccestoken! 🌟🌟🌟🌟🌟');
    req.roles = roles;
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.send({ status: info.status || 401, error: true, message: info.message || 'Unauthorized', ...info });
        }
        req.user = user;
        console.log(req.user, 'USER!');
        // return next();
        return true;
    })(req, res, next);
};

const authorizeAccessToken = async (req, res, next) => {
    console.log('authoriszeaccestoken!');
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.send({ status: info.status || 401, error: true, message: info.message || 'Unauthorized', ...info });
        }
        req.user = user;
        return next();
    })(req, res, next);
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginFromCookie = async (req, res) => {
    const db = app.get('db');

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err || !user) {
            console.log(err, 'error in passport.authenticate jwt');
            return res.send({ status: info.status || 401, error: true, message: info.message || 'Unauthorized' });
        }
        const season = await db.seasons.findOne({ is_active: true });

        // NEED TO CHANGE THIS TO BE OPTIMIZED
        const seasons = await db.seasons.find({ 'deleted_at =': null }).catch(error => console.log(error));
        // NEED TO CHANGE THIS TO BE OPTIMIZED

        await db.users.update({ id: user.id }, { last_login: new Date() }).catch(error => console.log(error, 'update last_login error on cookie login'));

        return res.send({ status: 200, data: { user, season, seasons }, message: 'Welcome back! You\'re logged in on refresh!' });
    })(req, res);
};


/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const login = async (req, res) => {
    const db = app.get('db');
    passport.authenticate('local-login', async (err, user, info) => {
        if (err || !user) {
            return res.send({ status: info.status || 404, error: true, message: info.message || 'Incorrect email or password.', notification_type: 'snack' });
        }

        return req.login(user, { session: false }, async (errr) => {
            if (errr) {
                console.log(errr, 'errr');
                return res.send({ status: 500, error: true, message: `An error occurred: ${errr}` });
            }

            const season = await db.seasons.findOne({ is_active: true });
            await db.users.update({ id: user.id }, { last_login: new Date() }).catch(error => console.log(error, 'update last_login error on LOCAL login'));
            const access_token = jwt.sign({ user, season }, JWT_SECRET);
            return res.send({ status: 200, data: { user, season, access_token }, message: 'Welcome! You\'re logged in!' });
        });
    })(req, res);
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const signup = async (req, res) => {
    passport.authenticate('local-signup', async (err, user, info) => {
        if (err || !user) {
            console.log(err, user, info);
            return res.send({ status: 400, error: true, message: err || info.message, notification_type: 'snack' });
        }
        return res.send({ status: 200, data: [], message: 'Account created, please log in', notification_type: 'snack' });
    })(req, res);
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const invite = async (req, res) => {
    const db = app.get('db');
    const { email, first_name, last_name } = req.body;

    // console.log(req.user, 'req.user') // need to hook up to  auth.authorizeAccessToken, middleware to work

    const user = await db.users.findOne({ email });

    if (!!user) {
        if (!!user.invite_token) {
            return res.send({ status: 400, error: true, message: 'An invite for this user has already been sent out. Please reinvite user' });
        }
        return res.send({ status: 400, error: true, message: 'A user with this account email already exists' });
    }

    // set invite token with expiry
    const invite_token = jwt.sign({ email, first_name, last_name }, JWT_SECRET, { expiresIn: '8h' });
    // add user by email / add user names / add invite_token
    const newUser = await db.users.insert({ email, first_name, last_name, invite_token, invite_date: new Date() });
    // send email
    await emailer.sendmail({ template: 'inviteUser', data: { email, first_name, last_name, invite_token } });
    // await for response
    return res.send({ status: 200, data: { ...newUser, full_name: `${first_name} ${last_name}`, status: 'invited' }, message: 'An invitation has been sent', notification_type: 'snack' });
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const registerFromInvite = async (req, res) => {
    const db = app.get('db');
    const { first_name, last_name, password } = req.body;

    const { token: invite_token } = req.query;
    const decodedToken = jwt.decode(invite_token);

    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        // token expired, possibly resend email with new token here
        return res.send({ status: 400, error: true, message: 'Registration code has expired. Please contact your administrator for a new registration code.', notification_type: 'snack' });
    }

    // check for matching token
    const user = await db.users.findOne({ invite_token });

    if (!user) {
        return res.send({ status: 400, error: true, message: 'Registration code invalid. Please contact your administrator for a new registration code.', notification_type: 'snack' });
    }

    await db.users.update({ id: user.id }, { first_name, last_name });

    // confirm user has not already registered
    // (check to see if password exists)
    // store password
    const hash = await bcrypt.hash(password, 10);
    await db.passwords.insert({ user_id: user.id, pw: hash });
    // remove token
    await db.users.update({ id: user.id }, { invite_token: null }).catch(err => console.log(err, 'remove invite_token error'));

    return res.send({ status: 200, data: [], redirect: `/login?email=${user.email}`, message: 'Account created, you can now log in', notification_type: 'snack' });
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const resendInvite = async (req, res) => {
    const db = app.get('db');
    const { id } = req.params;
    const user = await db.users.findOne({ id });
    if (!user) {
        return res.send({ status: 400, error: true, message: 'User does not exist.', notification_type: 'snack' });
    }
    // set invite token with expiry
    const invite_token = jwt.sign({ email: user.email, first_name: user.first_name, last_name: user.last_name }, JWT_SECRET, { expiresIn: '8h' });
    // update invite_token
    // update reinvite_date
    await db.users.update({ id }, { invite_token, reinvite_date: new Date(), invite_date: null });
    // send email
    const { email, first_name, last_name } = user;

    const sendingMail = await emailer.sendmail({ template: 'inviteUser', data: { email, first_name, last_name, invite_token } });
    if (!sendingMail) {
        return res.send({ status: 400, error: true, message: 'Could not resend invite email, please try again later', notification_type: 'snack' });
    }
    /// need to fix this response if error, possibly use try catch
    return res.send({ status: 200, data: { reinvited: true }, message: 'User has been reinvited.', notification_type: 'snack' });
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const sendResetPassword = async (req, res) => {
    const db = app.get('db');
    const { email } = req.body;

    // should switch this to use a reset_passowrd_token instead of invite_token
    const user = await db.users.findOne({ email });

    if (!user) {
        // may not want to send this message string
        // internal = email does not exist
        return res.send({ status: 400, error: true, message: 'Email does not exist', notification_type: 'snack' });
        // return res.send({ status: 200, data: [], message: 'If an account matches, a reset password link will be sent' });
    }

    const invite_token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '8h' });

    await db.users.update({ id: user.id }, { invite_token });

    const sendingMail = await emailer.sendmail({ template: 'resetPassword', data: { email, first_name: user.first_name, invite_token } });

    if (!sendingMail) {
        return res.send({ status: 400, error: true, message: 'Could not send reset password email, please try again later', notification_type: 'snack' });
    }

    return res.send({ status: 200, data: { resetSent: true }, message: 'A reset password link has been sent' });
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updatePassword = async (req, res) => {
    const db = app.get('db');
    const { password, password_confirmation } = req.body;
    const { token: invite_token } = req.params;

    if (password !== password_confirmation) {
        return res.send({ status: 400, error: true, message: 'Passwords must match.', notification_type: 'snack' });
    }

    const decodedToken = jwt.decode(invite_token);

    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
        // token expired, possibly resend email with new token here
        return res.send({ status: 400, error: true, message: 'Reset password code has expired. Please reset password again.', notification_type: 'snack' });
    }

    // check for matching token
    const user = await db.users.findOne({ invite_token });

    if (!user) {
        return res.send({ status: 400, error: true, message: 'Reset password code has expired. Please reset password again.', notification_type: 'snack' });
    }

    // store password
    const hash = await bcrypt.hash(password, 10);
    await db.passwords.update({ user_id: user.id }, { pw: hash });
    // remove token
    await db.users.update({ id: user.id }, { invite_token: null }).catch(err => console.log(err, 'remove invite_token error'));

    return res.send({ status: 200, data: [], message: 'Password reset', redirect: '/login', notification_type: 'snack' });
};

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
};


// Passport

/// /////////////// LOGIN //////////////////

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const db = app.get('db');
        // const user2 = await db.users.findOne({ email });
        const q = `
            SELECT u.*, ARRAY_AGG(json_build_object('role_id', r.id, 'name', r.name)) AS roles
            FROM users u 
            JOIN user_role ur ON ur.user_id = u.id 
            JOIN roles r ON r.id = ur.role_id
            WHERE email = $1
            GROUP BY u.id;
        `;

        const [user] = await db.query(q, [email]);

        if (!user) {
            return done(null, false, { status: 400, message: 'Incorrect email or password', internal_message: 'USER_NOT_FOUND' });
        }

        if (user.is_suspended) {
            // return done(null, false, { message: 'User has been suspended', internal_message: 'USER_SUSPENDED' })
            return done(null, false, { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', internal_message: 'USER_SUSPENDED' });
        }

        if (user.reinvite_date) {
            await db.users.update({ id: user.id }, { reinvite_date: null }).catch(err => console.log(err, 'update local-login error on sign in'));
        }

        const pw = await db.passwords.findOne({ user_id: user.id });
        const comparedPassword = await bcrypt.compare(password, pw.pw);

        if (!comparedPassword) {
            return done(null, false, { status: 400, message: 'Invalid password.' });
        }

        // get associated player registrations here

        // optimize this query so we dont have to run javascript after query happens
        // query = get all players from previous registrations associated with logged in account

        const query = `
            SELECT t.name AS previous_team, p.*, r.* FROM registrations r
            JOIN players p ON p.id = r.player_id
            LEFT JOIN player_team_season pt ON pt.player_id = p.id
            LEFT JOIN teams t ON t.id = pt.team_id
            WHERE r.user_id = $1 ORDER BY r.player_id desc;
        `;

        const data = await db.query(query, [user.id]);

        const associated_accounts = [];
        data.reduce((acc, curr) => {
            if (acc.indexOf(curr.player_id) === -1) {
                acc.push(curr.player_id);
                associated_accounts.push(curr);
            }
            return acc;
        }, []);

        return done(null, { ...user, associated_accounts });
    } catch (error) {
        console.log('LOCAL-LOGIN ERROR: ', error);
        return done(null, false, { status: 500, message: 'Could not login' });
    }
    // Find the user asssociated with the email provided
}));


/// /////////////// SIGNUP //////////////////

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const db = app.get('db');
        const user = await db.users.findOne({ email });

        if (user) {
            return done(null, false, { status: 409, message: 'Account with this email already exists, please sign in.' });
        }

        const { first_name, last_name } = req.body;

        const newUser = await db.users.insert({ first_name, last_name, email, created_at: new Date() });
        const hash = await bcrypt.hash(password, 10);
        await db.passwords.insert({ user_id: newUser.id, pw: hash });

        return done(null, newUser);
    } catch (error) {
        console.log('LOCAL-SIGNUP ERROR: ', error);
        return done(null, false, { status: 500, message: 'Could not create account' });
    }
}));


/// /////////////// JWT //////////////////

passport.use('jwt', new JWTStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
}, async (req, token, done) => {
    // console.log(req.roles, 'req.roles in JWT')
    // console.log(token.user, 'token.user in JWT')
    try {
        // console.log(req.roles && req.roles.includes(token.user.admin_type), 'INCLUDEZZ');

        // NOTE: took this out as elimited the need for admin_type
        // // if list of roles exists, check to see if the current user's admin_type is in the roles list
        // if (req.roles && !req.roles.includes(token.user.admin_type)) {
        //     console.log('DOES NOT ROLSE');
        //     // return done(null, false, {message: 'Cant access this route because you must be one of ' + req.roles})
        //     return done(null, false, { status: 401, message: 'You do not have permission for this action', redirect: '/dashboard', notification_type: 'snack' });
        // }

        const isSuspended = await checkSuspended(token.user.id);
        if (!!isSuspended) {
            return done(null, false, isSuspended);
        }
        // console.log('yo')
        return done(null, token.user);
    } catch (err) {
        console.log(err, 'catch!');
        return false;
    }
}));


// this fires on every admin request - too much?
const checkSuspended = async (id) => {
    const db = app.get('db');
    const user = await db.users.findOne({ id });
    if (!user) {
        return { status: 404, message: 'User could not be found', shouldLogOut: true };
    }
    if (user.is_suspended) {
        // return { status: 401, message: 'Your account has been disabled. Please contact the league administrator.', shouldLogOut: true };
        return { status: 401, message: 'Your account has been disabled. Please contact the league administrator.' };
    }
    return false;
};
