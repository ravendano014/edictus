const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({  
  host     : process.env.host_db,  
  user     : process.env.user_db,  
  password : process.env.password_db,  
  database : process.env.name_db,    
});    

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;
