let mysqlx = require('@mysql/xdevapi');
let session = require('express-session');
let dbConf = require('./config/dbConf.js');
let sessionConf = require('./config/sessionConf.js');
let queryBuilder = require('./queryBuilder.js');

// Tweak Zone

let options = {
  maxLimit: 50000,
  populateStride: 1000
};

// End Tweak Zone

class Database {

  constructor(args) {
    this.pool = args.client.getClient(...args.dbConf.mysqlx);
    this.session = args.session;
    this.sessionConf = args.sessionConf;
  }

  dePopulateSession(sessionID) {
    console.log("trying to depopulate");
    return new Promise((resolve, reject) => {
      this.pool.getSession().then(connection => {
        var deleteSQL = `DELETE FROM sessionTweet WHERE sessionTweet.session_id='${sessionID}'`;
        console.log(deleteSQL);
        connection.sql(deleteSQL).execute()
        .then( results => {
          console.log(results.fetchAll());
          connection.close();
          resolve();
        }).catch(err => console.log(err));
      });
    })
  }

  populateSession(sessionID, filters) {
    return new Promise((resolve, reject) => {
      if (filters.page * options.populateStride >= options.maxLimit) reject("Past max limit.")
      else {
        this.pool.getSession().then(connection => {
          // let sessionPopulateSQL = `CALL sessionFilter('${sessionID}','${filters.langList + ", "}','${filters.hashtags}','${filters.usernames}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*populateStride},${populateStride});`;
          let sessionPopulateSQL = queryBuilder.buildQuery(sessionID, filters, options);
          console.log(sessionPopulateSQL);
          connection.sql(sessionPopulateSQL).execute()
          .then( results => {
            resolve(results.getAffectedItemsCount());
            connection.close();
          })
          .catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
    });
  }

  fetchDbResults(sessionID, proc) {
    return new Promise((resolve, reject) => {
      this.pool.getSession().then(connection => {
        var fetchSQL = `CALL ${proc}('${sessionID}',${options.maxLimit})`;
        connection.sql(fetchSQL).execute().then(results => {
          resolve(results.fetchAll());
          //resolve(typeof(results[0][0]) !== undefined ? results : [{from_user: "No Results", text: "Please try again."}]);
          connection.close();
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    })
  }
};

module.exports = new Database({client: mysqlx, session: session, dbConf: dbConf, sessionConf: sessionConf});
