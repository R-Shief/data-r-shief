var express = require('express');
var database = require('../database.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: "R-Shief Dashboard" }, function(err, html) {
      console.log(err);
      res.send(html);
  })

})

router.put('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page', function (req, res, next) {
  console.log("session id is: " + req.sessionID);
  Promise.resolve( () => { if (req.params.page == 0) return database.dePopulateSession(req.sessionID) } )
  .then(_ => database.populateSession(req.sessionID, req.params))
  .then(success => {console.log("foo: " + success); return res.send(success);})
  .catch(failure => res.send(failure));
});

router.get('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page/:fetch', function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  (new Promise( (resolve, reject) => {
    let proc;
    switch (req.params.fetch) {
      case 'uStreamgraph':
        proc = 'userOccurrences';
        break;
      case 'uCirclePacking':
        proc = 'users';
        break;
      case 'htStreamgraph':
        proc = 'hashtagOccurrences';
        break;
      default:
        throw new Error('Invalid URL filter fetch parameter.');
    };
    resolve(
      database.fetchDbResults(req.sessionID, proc)
    );
  }))
  .then(results => {
    return res.json(JSON.stringify(results));
  })
  .catch((error) => {
    console.log(error);
    return res.json("{'error': 'Invalid filter URL.'}");
  });

});

module.exports = router;
