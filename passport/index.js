const local = require('./localStrategy');
// const google = require('./googleStrategy');
const executeQuery = require('../models/database');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser(async (id, done) => {
        const result = await executeQuery(`select userId, email, userName from user where email = ? and deletedAt is null`, ['cubeclock94@gmail.com']);
        if (result.rows.length === 1) {
            done(null, result.rows[0]);
        } else {
            done(new Error('user not exist'));
        }
    });

    local(passport);
}