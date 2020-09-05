let mysqlx = require('@mysql/xdevapi');
let session = require('express-session');
let dbConf = require('./config/dbConf.js');
let sessionConf = require('./config/sessionConf.js');

// Tweak Zone

let maxLimit = 1000000;
let populateStride = 10000;

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
      if (filters.page * populateStride >= maxLimit) reject("Past max limit.")
      else {
        this.pool.getSession().then(connection => {
          // let sessionPopulateSQL = `CALL sessionFilter('${sessionID}','${filters.langList + ", "}','${filters.hashtags}','${filters.usernames}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*populateStride},${populateStride});`;
          let hashtagBit = filters.hashtags == "*" ? "" :
            `EXISTS (
              SELECT hashtag_id
              FROM hashtag as h
              WHERE MATCH(h.hashtag_name) AGAINST ('+${filters.hashtags}' IN BOOLEAN MODE) > 8
            )`;

          let orBit = [filters.hashtags, filters.usernames].some(x => x == "*") ? "" : "OR"

          let usernameBit = filters.usernames == "*" ? "" :
            `EXISTS (
              SELECT user_id
              FROM user as u
              WHERE u.username LIKE CONCAT('${filters.usernames}', "%")
            )`;

          let conditionals = [filters.hashtags, filters.usernames].some(x => x != "*") ? `AND (${hashtagBit} ${orBit} ${usernameBit})` : "";

          let sessionPopulateSQL = `
            INSERT INTO sessionTweet (session_id, twitter_id)
              SELECT '${sessionID}', t.twitter_id
              FROM tweet AS t
                INNER JOIN tweetHashtag AS th ON t.twitter_id = th.twitter_id
                INNER JOIN hashtag AS h ON h.hashtag_id = th.hashtag_id
              WHERE
                t.lang_code IN ( ${filters.langList.split(",").map(l => `'${l}'`)} )
              ${conditionals}
              AND t.created_at BETWEEN '${filters.startDate}' AND '${filters.endDate}'
              LIMIT ${filters.page*populateStride}, ${populateStride}
              ON DUPLICATE KEY UPDATE sessionTweet.session_id=sessionTweet.session_id;
          `;

          console.log(sessionPopulateSQL);
          connection.sql(sessionPopulateSQL).execute()
          .then( results => {
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
      this.pool.getSession().then(connection => {
        var fetchSQL = `CALL ${proc}('${sessionID}',${maxLimit})`;
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
