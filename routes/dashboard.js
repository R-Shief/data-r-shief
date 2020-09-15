var express = require('express');
var database = require('../database.js');
var dashDefaults = require('../config/dashDefaults.js');
var languages = require('../dist/data/languages.js');
var iso_3166 = require('../dist/data/iso-3166.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard/dashboard', {
    title: "R-Shief Dashboard",
    dashOpts: dashDefaults,
    languages: languages,
    countries: iso_3166
  }, function(err, html) {
      console.log(err);
      res.send(html);
  })

})

router.get('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page', function(req, res, next) {
  res.render('dashboard/dashboard', {
    title: "R-Shief Dashboard",
    dashOpts: dashDefaults,
    languages: languages,
    countries: iso_3166
  }, function(err, html) {
      console.log(err);
      res.send(html);
  })
})

router.put('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page', function (req, res, next) {
  var result = Promise.resolve()
  .then(_ => { if (req.params.page == 0) return database.dePopulateSession(req.sessionID) })
  .then(_ => database.populateSession(req.sessionID, req.params))
  .then(success => res.sendStatus(200))
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
      case 'lgStreamgraph':
        proc = 'languageOccurrences';
        break;
      case 'htRanking':
        proc = 'hashtagCounts';
        break;
      case 'urlRanking':
        proc = 'urlCounts';
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
