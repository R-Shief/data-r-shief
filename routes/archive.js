var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('archive', { title: "RShief Archive Viewer", keywords: [], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"} });
})

var results;
router.post('/viewer', function (req, res, next) {
  filters = req.body;
  var [selectSQL, countSQL] = queryBuilder.buildQuery(filters);

  var connection = mysql.createConnection({
    host: '169.231.235.135', // make this 10.1.3.66 on production side
    user: 'rshiefuser',
    password: 'lqHr2O#&yFZrg#sRc8WAeED%iy7bZMzh88t59Y0q',
    database: 'rshiefArchViewer'
  })

  connection.connect(function(err, data){
    if (err) { next(err) }
    connection.query(selectSQL, function(err, rows, fields) {
      if (err) throw err
      results = rows;
    })
  })
});

router.get('/viewer', function(req, res, next) {
    res.render('dbResults', {rows: results}, function(err, html) {
        console.log("this");
        res.json({dbResults: html, nResults: results.length});
        console.log("guy");
        connection.end();
    })
});

module.exports = router;
