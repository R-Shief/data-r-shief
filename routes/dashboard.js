var express = require('express');
var database = require('../database.js');
var filterDefaults = require('../config/filterDefaults.js');
var router = express.Router();
var usernames = require('../bigData/usernames.json');
var procMap = require('../config/procMap.js');

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard/dashboard', {
    filterDefaults: filterDefaults
  }, function(err, html) {
      if(err) console.log(err);
      res.send(html);
  })

})

router.get('/:langList/:startDate/:endDate/:hashtags/:usernames/:page', function(req, res, next) {
  res.render('dashboard/dashboard', {
    filterDefaults: Object.assign(filterDefaults, req.params)
  }, function(err, html) {
      if (err) console.log(err);
      res.send(html);
  })
})

router.put('/:langList/:startDate/:endDate/:hashtags/:usernames/:page', function (req, res, next) {
  if (req.params.page == 0) database.dePopulateSession(req.sessionID);
  var result = Promise.resolve()
  .then(_ => database.populateSession(req.sessionID, req.params))
  .then(success => res.json({rowsAffected: success}))
  .catch(failure => res.send(failure));
});

router.get('/:usernameQuery', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  const ret = req.params.usernameQuery != "*" ? usernames.usernames.filter(username => username.includes(req.params.usernameQuery)).slice(0, 100) : [];
  res.json(ret);
})

router.get('/:langList/:startDate/:endDate/:hashtags/:usernames/:page/:fetch', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  (new Promise( (resolve, reject) => {
    let proc = procMap[req.params.fetch];
    if (!proc) throw new Error('Invalid URL filter fetch parameter.');
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
