var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var router = express.Router();

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('archive', { title: "RShief Archive Viewer", keywords: ['Express', 'foo', 'bar'], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"} });
})

router.get('/getResults', function(req, res, next) {
  console.log("whaaaaaa", req.params);

  var locals = {results: []};

  var connection = mysql.createConnection({
    host: '169.231.235.115', // make this 10.1.3.66 on production side
    user: 'rshiefuser',
    password: 'lqHr2O#&yFZrg#sRc8WAeED%iy7bZMzh88t59Y0q',
    database: 'rshief_with_data'
  })

  connection.connect(function(err, data){
    if (err) { next(err) }
    var sql = queryBuilder.buildQuery(req.body);

    connection.query(sql, function(err, rows, fields) {
      if (err) throw err

      res.render('dbResults', rows, function(err, html) {
        res.json({dbResults: html});
      })

      //locals.results.push({user: rows[0].from_user, text: rows[0].text})
    })

  })

  connection.end()
});

module.exports = router;
