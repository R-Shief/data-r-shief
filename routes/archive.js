var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('archive', { title: "RShief Archive Viewer", keywords: [], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"} });
})

router.post('/updateViewer', function (req, res, next) {
  //console.log("request body", req.body);
  filters = req.body;
});

router.get('/getUpdatedViewer', function(req, res, next) {
  var sql = queryBuilder.buildQuery(filters);
  //console.log(sql);

  var connection = mysql.createConnection({
    host: '169.231.235.135', // make this 10.1.3.66 on production side
    user: 'rshiefuser',
    password: 'lqHr2O#&yFZrg#sRc8WAeED%iy7bZMzh88t59Y0q',
    database: 'rshiefArchViewer'
  })
  connection.connect(function(err, data){
    if (err) { next(err) }

    connection.query(sql, function(err, rows, fields) {
      if (err) throw err
      //console.log(rows);

      res.render('dbResults', {rows: rows}, function(err, html) {
        console.log(err);
        res.json({dbResults: html});
        connection.end();
      })
    })

  })

  //connection.end()
});

module.exports = router;
