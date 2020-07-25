var express = require('express');
var mysql = require('mysql');
var dbConf = require('../config/dbConf.json');
var router = express.Router();
var filters = {};

// Tweak Zone

let limit = 1000;

// End Tweak Zone

let pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConf.host,
  user: dbConf.user,
  password: dbConf.password,
  database: dbConf.database
});

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: "R-Shief Dashboard" }, function(err, html) {
      res.send(html);
  })

})

router.get('/:langList/:startDate/:endDate/:keywords/:page/:fetch?', function (req, res, next) {

  // this is a work in progress. I think the way it should actually work is with sessions.
  Promise.resolve(
    if (connection == undefined) {
      pool.getConnection((err, connection) => {
        resolve(connection);
      })
    }
    else {
      resolve(connection);
    }
  )
  .then((connection) => {
    populateSession(req.params).then((success) => resolve("Success!"));
  })
  .then()

  if ( req.params.fetch == undefined ) {

    if (connection == undefined) {
      pool.getConnection((err, connection) => {
        populateSession(req.params);
      });
    }


  }
  else {

    Promise((resolve, reject) => {
      let proc;
      switch (req.params.fetch) {
        case 'uStreamgraph':
          proc = 'userOccurrences';
        case 'uCirclePacking':
          proc = 'users';
        case 'htStreamgraph':
          proc = 'hashtagOccurrences';
        default:
          res.json("{'error': 'Invalid filter URL.'}")
      }
      resolve(proc);
    })
      .then( (proc) => {
        fetchDbResults(proc)
          .then((results) => {
            //console.log(results);
            res.json(JSON.stringify(results))
          });
      });

  };
});

function populateSession(filters) {
  console.log("attempting this.");
  return new Promise((resolve, reject) => {
    let sessionPopulateSQL = `CALL sessionFilter('${filters.langList + ", "}','${filters.keywords}','${filters.startDate}','${filters.endDate}',${filters.page*limit},${limit});`;
    connection.query(sessionPopulateSQL, function (error, results, fields) {
      if (error) throw error;
      resolve("Success!");
    })
  })
}

function fetchDbResults(proc) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      var fetchSQL = `CALL ${proc}(${limit})`;
      connection.query(fetchSQL, function (error, results, fields) {
        if (error) throw error;
        resolve(typeof(results[0][0]) !== undefined ? results : [{from_user: "No Results", text: "Please try again."}]);
      })
    })
  })
}

module.exports = router;
