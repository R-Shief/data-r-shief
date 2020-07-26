let mysql = require('mysql');
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
let dbConf = require('./config/dbConf.js');
let sessionConf = require('./config/sessionConf.js');

// Tweak Zone

let limit = 10000;
let populateStride = 1000;

// End Tweak Zone

module.exports = {
  pool: mysql.createPool(dbConf),
  sessionStore: new MySQLStore(dbConf, this.pool),
  session: session,
  sess: function() {
      sessionConf.store = this.sessionStore;
      return sessionConf;
  },
  populateSession: function(sessionID, filters) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        var deleteSQL = `DELETE FROM sessionTweet WHERE sessionTweet.session_id='${sessionID}'`;
        connection.query(deleteSQL);
        let sessionPopulateSQL = `CALL sessionFilter('${sessionID}','${filters.langList + ", "}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*populateStride},${populateStride});`;
        connection.query(sessionPopulateSQL, function (error, results, fields) {
          if (error) throw error;
          resolve("Success!");
          connection.release();
        });
      })
    })
  },
  fetchDbResults: function(sessionID, proc) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) throw err;
        var fetchSQL = `CALL ${proc}('${sessionID}',${limit})`;
        connection.query(fetchSQL, function (error, results, fields) {
          if (error) throw error;
          resolve(results);
          //resolve(typeof(results[0][0]) !== undefined ? results : [{from_user: "No Results", text: "Please try again."}]);
          connection.release();
        })
      })
    })
  }
};
