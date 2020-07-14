var express = require('express');
var mysql = require('mysql');
var queryBuilder = require('../queryBuilder.js');
var dbConf = require('../config/dbConf.json');
var router = express.Router();
var filters = {};

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
  return new Promise( (resolve, reject) => {
    var [selectSQL, countSQL] = queryBuilder.buildQuery(filters);
    database = new Database({
      host: dbConf.host,
      user: dbConf.user,
      password: dbConf.password,
      database: dbConf.database
    });

    database.query(selectSQL)
      .then( rows => {
        console.log("got here");
        results = typeof(rows[0][0]) !== undefined ? rows : [{from_user: "No Results", text: "Please try again."}];
      })
      .then( rows => { database.close() } )
      .then( x => { resolve(results) } );
  });
}

// This wrapper was copied from here: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
// Thank you Michał Męciński
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

module.exports = router;
