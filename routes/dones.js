const express = require('express');
const router = express.Router();
const executeQuery = require('../models/database');
const { isLoggedIn } = require('./middlewares');

router.use(isLoggedIn);

router.get('/', async (req, res, next) => {
    try {
        const result = await executeQuery(`
            select 
                date_format(convert_tz(createdAt, '+00:00', '+09:00'), '%Y-%m-%d') as todoDate 
            from todo 
            where 
                ownerId = ? 
                and datediff(convert_tz(createdAt, '+00:00', '+09:00'), convert_tz(now(), '+00:00', '+09:00')) != 0 
            group by todoDate desc
         `, [ req.user.userId ]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/:date', async (req, res, next) => {
    try {
        const result = await executeQuery(`
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
                and datediff(convert_tz(t.createdAt, '+00:00', '+09:00'), ?) = 0
        `, [ req.user.userId , req.params.date + ' 00:00:00']);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;