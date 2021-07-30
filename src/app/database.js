const mysql = require("mysql2")

const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_PASSWORD,
    MYSQL_USER
} = require('./config')

const connections = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    database: MYSQL_DATABASE,
    password: MYSQL_PASSWORD,
    user: MYSQL_USER
})

connections.getConnection((err, conn) => {
    conn.connect(err => {
        if (err) {
            console.log("数据库连接失败");
        } else {
            console.log("数据库连接成功");
        }
    })
})

module.exports = connections.promise()