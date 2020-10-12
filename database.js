
const {dbSecrets, sessionSecrets} = require('./config/secrets.js');
let mysqlx = require('@mysql/xdevapi');
let session = require('express-session');
let MysqlXStore = require('./express-session-mysqlx.js')(session);
let queryBuilder = require('./queryBuilder.js');

// Tweak Zone
let options = {
  maxLimit: 50000,
  populateStride: 1000
};
// End Tweak Zone

class Database {

  constructor(client) {

    let scope = this;

    // Configure db connection
    const mysqlConfig = [{
      host: dbSecrets.host,
      port: dbSecrets.port,
      user: dbSecrets.user,
      password: dbSecrets.password,
      schema: dbSecrets.database
    },
    {
      pooling: {
        enabled: true,
        maxSize: 10
      }
    }];
    this.pool = client.getClient(...mysqlConfig);

    // this.mysqlXStore = new MysqlXStore({client: scope.pool, schema: dbSecrets.database, collection: "sessions"});
    // this.mysqlXStore.set("12345asdf", {foo: "bar", fizz: "buzz", bar: "fuzz"});
    // this.mysqlXStore.set("zzzzzxxxxccccc", {foooooo: "barrrrrr", fizzzzz: "buzzzzzz", barrrrr: "fuzz"});
    // this.mysqlXStore.length((err, length) => console.log(length));
    // this.mysqlXStore.get("12345asdf", (err, doc) => console.log(doc));
    // this.mysqlXStore.touch("12345asdf");
    // this.mysqlXStore.clear();

    var env = process.env.NODE_ENV || 'development';
    this.session = session({
      secret: sessionSecrets.secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1200000,
        secure: env === 'production',
        sameSite: 'none'
      },
      name: 'rshiefconnect.sid',
      store: new MysqlXStore({client: scope.pool, schema: dbSecrets.database, collection: "sessions"})
    });

  }

  dePopulateSession(sessionID) {
    // console.log("trying to depopulate");
    return new Promise((resolve, reject) => {
      this.pool.getSession().then(connection => {
        var deleteSQL = `DELETE FROM sessionTweet WHERE sessionTweet.session_id='${sessionID}'`;
        // console.log(deleteSQL);
        connection.sql(deleteSQL).execute()
        .then( results => {
          // console.log(results.fetchAll());
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
          // console.log(sessionPopulateSQL);
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

  fetchDbResults(proc, ...args) {
    return new Promise((resolve, reject) => {
      this.pool.getSession().then(connection => {
        var fetchSQL = `CALL ${proc}('${args.length == 1 ? args[0] : args.join(",")}',${options.maxLimit})`;
        connection.sql(fetchSQL).execute().then(results => {
          resolve(results.fetchAll());
          //resolve(typeof(results[0][0]) !== undefined ? results : [{from_user: "No Results", text: "Please try again."}]);
          connection.close();
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    })
  }
};

module.exports = new Database(mysqlx);
