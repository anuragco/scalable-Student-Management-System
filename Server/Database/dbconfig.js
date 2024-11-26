const mysql = require('mysql');

const pool = mysql.createPool({
  host: "database-1.c76ew6kw8abd.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "123#sinGH#",
  port: 3306,
  database: "studentmanagement",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool; 
