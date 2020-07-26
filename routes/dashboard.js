var express = require('express');
var database = require('../database.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: "R-Shief Dashboard" }, function(err, html) {
      res.send(html);
  })

})

router.put('/:langList/:startDate/:endDate/:keywords/:page', function (req, res, next) {
  database.populateSession(req.sessionID, req.params)
  .then((success, failure) => {
    return res.send("yay");
  });
});

router.get('/:langList/:startDate/:endDate/:keywords/:page/:fetch', function (req, res, next) {

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
