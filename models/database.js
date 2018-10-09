const mysql = require('mysql2/promise');
const config = require('../config/config.json');

const connectionProperties = {
    host     : config[process.env.MODE].host,
    user     : config[process.env.MODE].username,
    password : config[process.env.MODE].password,
    database : config[process.env.MODE].database
};

// let conn;
// (async () => {
//     conn = await mysql.createConnection(connectionProperties);
// })();

const pool = mysql.createPool({
    ...connectionProperties,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function executeQuery(queryString, parameter = []) {
    // const [rows, fields] = await conn.execute(queryString, parameter);

    // promise execute에서 실제 실행된 query를 확인하는건 업데이트를 기다려야 할 듯 하다.
    // https://github.com/sidorares/node-mysql2/pull/555
    const [ rows, fields ] = await pool.execute(queryString, parameter);

    return { rows, fields };
}

module.exports = executeQuery;