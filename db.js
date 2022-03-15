const mysql = require("mysql2");
// const util = require("util");
const DB_HOST = 'localhost'
const DB_USER ='root' 
const DB_PASSWORD ="" 
const DB_DATABASE = 'image_upload_test'

const dbConn = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,       //This is your localhost IP
    user: DB_USER,         // "newuser" created in Step 1(e)
    password: DB_PASSWORD,  // password for the new user
    database: DB_DATABASE,      // Database name
})
// dbConn.getConnection((err, connection) => {
//     if (err) throw (err)
//     console.log("DB connected successful: " + connection.threadId)
// })
dbConn.getConnection((err, connection) => {

    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection)
        console.log("The connection is established")
    if (connection) connection.release()
    return
})

module.exports = dbConn.promise();