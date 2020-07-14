var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var dbConf = require('../config/dbConf.json');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('archive', { title: "RShief Archive Viewer", keywords: [], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"} });
})

var results;
router.get('/:langList/:start/:end/:keywords/:page', function (req, res, next) {
  console.log("trying");
  filters = req.params;
  var [selectSQL, countSQL] = queryBuilder.buildQuery(filters);

  console.log(selectSQL);

  var connection = mysql.createConnection({
    host: dbConf.host,
    user: dbConf.user,
    password: dbConf.password,
    database: dbConf.database
  });

  connection.connect(function(err, data){
    if (err) { next(err) }
    connection.query(selectSQL, function(err, rows, fields) {
      if (err) throw err
      results = typeof(rows[0][0]) !== undefined ? rows : {from_user: "No Results", text: "Please try again."};

      res.render('dbResults', {rows: results}, function(err, html) {
          res.send({dbResults: html, nResults: results.length});
          connection.end();
      })
    })
  })


});

module.exports = router;
