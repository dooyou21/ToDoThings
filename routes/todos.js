const express = require('express');
const router = express.Router();
const executeQuery = require('../models/database');
const { isLoggedIn } = require('./middlewares');

router.use(isLoggedIn);

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await executeQuery(`
            select 
                t.memo, 
                date_format(convert_tz(t.createdAt, '+00:00', '+09:00'), '%Y-%m-%d %T') as todoDate, 
                t.isDone,
                c2.categoryId,
                c2.categoryName,
                date_format(convert_tz(t.completedAt, '+00:00', '+09:00'), '%Y-%m-%d %T') as completedAt
            from todo as t
            left join Categorization as c1 on t.todoId = c1.todoId
            left join category as c2 on c1.categoryId = c2.categoryId
            where 
                t.ownerId = ?
                and datediff(convert_tz(t.createdAt, '+00:00', '+09:00'), convert_tz(now(), '+00:00', '+09:00')) = 0
        `, [ req.user.userId ]);
        res.json(rows);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const memo = req.body.todoContents;
    if (!memo) {
        return res.json({ resultCode: -1, errorMessage: '내용을 입력해주세요.' });
    }
    try {
        await executeQuery(`insert into todo ( memo, ownerId ) values ( ?, ? )`, [ memo, req.user.userId ]);
        res.redirect('/todo');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

// TODO: todo수정
router.put('/:todoId', (req, res, next) => {
// 1. todoId 존재하는지 확인
// 2. const {isCompeted, todoContents } = req.body
// 3. isCompleted 존재하면 completed update. true이면 completedAt 에 시간 업데이트 하고, false이면 completedAt null 업데이트
// 4. todolist 로 redirect
});

// TODO: todo삭제
router.delete('/:todoId', (req, res, next) => {
// 1. todoId 존재하는지 확인하고 존재하면 지운다.
// 2. todolist 로 redirect
});

module.exports = router;