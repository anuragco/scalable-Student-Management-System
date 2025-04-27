const mysql = require('mysql');

const pool = mysql.createPool({
  ost: "localhost",
  user: "root",
  password: "",
  port: 4306,
  database: "studentmanagement",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool; 
