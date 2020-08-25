let mysqlx = require('@mysql/xdevapi');
let session = require('express-session');
let MySQLxStore = require('./express-mysqlx-session')(session);
let dbConf = require('./config/dbConf.js');
let sessionConf = require('./config/sessionConf.js');

// Tweak Zone

let maxLimit = 10000;
let populateStride = 1000;

// End Tweak Zone

module.exports = {
  pool: mysqlx.getClient(...dbConf.mysqlx),
  sessionStore: function() {
    this.pool.getSession()
    .then(connection => new MySQLxStore(dbConf.mysqlstore, connection) )
    .catch(err => console.log(err));
  },
  session: session,
  sess: function() {
      Object.assign(sessionConf, {store: this.sessionStore()});
      return sessionConf;
  },
  dePopulateSession: function(sessionID) {
    return new Promise((resolve, reject) => {
      this.pool.getSession((err, connection) => {
        var deleteSQL = `DELETE FROM sessionTweet WHERE sessionTweet.session_id='${sessionID}'`;
        connection.query(deleteSQL, (error, results, fields) => {
          if (error) throw error;
          connection.release();
        });
      });
    })
  },
  populateSession: function(sessionID, filters) {
    return new Promise((resolve, reject) => {
      if (filters.page * populateStride >= maxLimit) reject("Past max limit.")
      else {
        this.pool.getSession((err, connection) => {
          let sessionPopulateSQL = `CALL sessionFilter('${sessionID}','${filters.langList + ", "}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*populateStride},${populateStride});`;
          connection.query(sessionPopulateSQL, function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            resolve("Success!");
            connection.release();
          });
        });
      }
    });
  },
  fetchDbResults: function(sessionID, proc) {
    return new Promise((resolve, reject) => {
      this.pool.getSession((err, connection) => {
        if (err) throw err;
        var fetchSQL = `CALL ${proc}('${sessionID}',${maxLimit})`;
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
