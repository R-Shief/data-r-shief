let mysqlx = require('@mysql/xdevapi');
let session = require('express-session');
let MySQLxStore = require('./express-mysqlx-session')(session);
// let MySQLStore = require('express-mysql-session')(session);
let dbConf = require('./config/dbConf.js');
let sessionConf = require('./config/sessionConf.js');

// Tweak Zone

let maxLimit = 10000;
let populateStride = 1000;

// End Tweak Zone

class Database {

  constructor(args) {
    this.pool = args.client.getClient(...args.dbConf.mysqlx);
    this.sessionStore = this.pool.getSession()
      .then(connection => new args.storeClass(args.dbConf.mysqlstore, connection) )
      .catch(err => console.log(err));
    this.session = args.session;
    this.sessionConf = this.sessionStore
      .then(store => Object.assign(args.sessionConf, {store: store}));
  }

  dePopulateSession(sessionID) {
    console.log("trying to depopulate");
    return new Promise((resolve, reject) => {
      this.pool.getSession((err, connection) => {
        var deleteSQL = `DELETE FROM sessionTweet WHERE sessionTweet.session_id='${sessionID}'`;
        connection.sql(deleteSQL).execute(results => {
          console.log(results);
          connection.close();
        }).catch(err => console.log(err));
      });
    })
  }

  populateSession(sessionID, filters) {
    return new Promise((resolve, reject) => {
      if (filters.page * populateStride >= maxLimit) reject("Past max limit.")
      else {
        this.pool.getSession().then(s => {
          let sessionPopulateSQL = `CALL sessionFilter('${sessionID}','${filters.langList + ", "}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*populateStride},${populateStride});`;
          s.sql(sessionPopulateSQL).execute( results => {
            if (error) throw error;
            console.log("results are: " + results);
            resolve("Success!");
            connection.close();
          })
          .catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
    });
  }

  fetchDbResults(sessionID, proc) {
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

module.exports = new Database({client: mysqlx, session: session, storeClass: MySQLxStore, dbConf: dbConf, sessionConf: sessionConf});
