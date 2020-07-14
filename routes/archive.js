var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var dbConf = require('../config/dbConf.json');
var router = express.Router();
var filters = {};
var pool = mysql.createPool({
  connectionLimit: 10,
  host: dbConf.host,
  user: dbConf.user,
  password: dbConf.password,
  database: dbConf.database
});

router.use(express.json());

router.get('/', function(req, res, next) {
  console.log("foo: " + req.params[0]);
  results = [{from_user: "Please add at least one keyword filter.", text: ""}];
  res.render('archive', { title: "RShief Archive Viewer", keywords: [], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"}, rows: results }, function(err, html) {
      res.send(html);
  })
})

router.get('/:langList/:start/:end/:keywords/:page', function (req, res, next) {
  results = fetchDbResults(req.params)
    .then( (results) => {
      //console.log(results);
      res.render('archive', { title: "RShief Archive Viewer", keywords: [], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"}, rows: results }, function(err, html) {
          res.send(html);
      })
    });
});

function fetchDbResults(filters) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      var [selectSQL, countSQL] = queryBuilder.buildQuery(filters);
      connection.query(selectSQL, function (error, results, fields) {
        resolve(typeof(results[0][0]) !== undefined ? results : [{from_user: "No Results", text: "Please try again."}]);
        connection.release();
      })
    })
  })
}

module.exports = router;
