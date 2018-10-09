const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const executeQuery = require('../models/database');
module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const { rows } = await executeQuery(`select * from user where email = ? and deletedAt is null`, [ email ]);
            if (rows.length === 0) {
                done(null, false, '가입되지 않은 회원');
            } else {
                const isMatched = await bcrypt.compare(password, rows[0].password);
                if (isMatched) {
                    done(null, rows[0]);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            }
        } catch (e) {
            console.error(e);
            done(e);
        }
    }));
}