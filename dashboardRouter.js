var express = require('express');
var database = require('./database.js');
var filterDefaults = require('./config/filterDefaults.js');
var router = express.Router();
var procMap = require('./config/procMap.js');

router.use(express.json());

router.get('/', function(req, res, next) {
  req.session.views = req.session.views || 0;
  req.session.views++;
  res.render('dashboard', {
    filterDefaults: filterDefaults,
    includeWix: "true",
    overviewUpOnStartup: req.session.views > 1 ? "false" : "true"
  }, function(err, html) {
      if(err) console.log(err);
      res.send(html);
  })

})

router.get('/:langList/:startDate/:endDate/:hashtags/:usernames', function(req, res, next) {
  req.session.views = req.session.views || 0;
  req.session.views++;
  let changes = Object.fromEntries(Object.entries(req.params).map(([key, val]) => [key, key == "langList" ? val.split(",") : val]));
  res.render('dashboard', {
    filterDefaults: Object.assign(filterDefaults, changes),
    includeWix: req.query.embed ? "false" : "true",
    overviewUpOnStartup: req.session.views > 1 ? "false" : "true"
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
  database.fetchDbResults('usernames', req.params.usernameQuery)
    .then(results => res.json(JSON.stringify(results)))
})

router.get('/:langList/:startDate/:endDate/:hashtags/:usernames/:page/:fetch', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  (new Promise( (resolve, reject) => {
    let proc = procMap[req.params.fetch];
    if (!proc) throw new Error('Invalid URL filter fetch parameter.');
    resolve(
      database.fetchDbResults(proc, req.sessionID)
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
