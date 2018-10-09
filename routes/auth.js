const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const executeQuery = require('../models/database');

const router = express.Router();
const passwordHashNum = 12;

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, userName, password } = req.body;
    try {
        const result = await executeQuery(`select userId, userName from user where email = ? and deletedAt is null`, [ email ]);
        const rows = result.rows;

        if (rows.length > 0) {
            req.flash('joinError', '이미 가입된 메일입니다.');
            return res.json({ resultCode: -1, errorMessage: '이미 가입된 메일입니다'});
        }

        const encryptedPassword = await bcrypt.hash(password, passwordHashNum);
        await executeQuery(`insert into user ( email, password, userName) values ( ?, ?, ? )`, [ email, encryptedPassword, userName ]);

        return res.json({ resultCode: 0, resultMessage: '회원가입이 완료되었습니다.' });
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
       if (authError) {
           console.error(authError);
           return next(authError);
       }
       if (!user) {
           req.flash('loginError', info.message);
           if (info.message) {
               return res.json({resultCode: -1, errorMessage: info.message});
           } else {
               return res.json({resultCode: -1, errorMessage: '사용자가 존재하지 않음'});
           }
       }
       return req.login(user, (loginError) => {
           if (loginError) {
               console.error(loginError);
               return next(loginError);
           }
           return res.redirect('/');
       });
   })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.session.destory();
    res.redirect('/');
});

router.post('/changepassword', isLoggedIn, async (req, res, next) => {
    try {
        const { rows } = await executeQuery('select password from user where userId = ? and deletedAt is null', [ req.user.userId ]);
        const isMatched = await bcrypt.compare(req.body.oldPassword, rows[0].password);

        if (!isMatched) {
            res.json({ resultCode: -1, resultMessage: '현재 비밀번호가 일치하지 않습니다.'});
        } else {
            const encryptedPassword = await bcrypt.hash(req.body.newPassword, passwordHashNum);
            await executeQuery('update user set password = ? where email = ?', [ encryptedPassword, req.body.email ]);
            res.json({ resultCode: 0, resultMessage: '비밀번호가 변경되었습니다.'});
        }

    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;