var express = require('express');
var database = require('../database.js');
var router = express.Router();
var filters = {};

router.use(express.json());

router.get('/', function(req, res, next) {
  res.render('dashboard', {
    title: "R-Shief Dashboard",
    dashOpts: {
      filters: [
        {id: "#language", type: "checkbox", fkey: "langList", default: ["ar", "en", "fr"]},
        {id: "#country", type: "checkbox", fkey: "countries", default: ["af", "be", "mz"]},
        {id: "#source", type: "checkbox", fkey: "sources", default: ["023", "622", "131"]},
        {id: "#from", type: "datebox", fkey: "startDate", default: "2011-12-12"},
        {id: "#to", type: "textbox", fkey: "endDate", default: "2013-12-12"},
        {id: "#hashtagsText", type: "textbox", fkey: "hashtags", default: "*"},
        {id: "#usernamesText", type: "textbox", fkey: "usernames", default: "*"},
        {id: "#keywordsText", type: "textbox", fkey: "keywords", default: "*"}
      ],
      filterBar: {
        id: "#filterBar",
        goButton: {id: "#filterGoButton", default: "disabled"},
        clippable: {id: "#sharelink", default: req.originalUrl}
      },
      vizs: [
        {id: "#userPacking", classKey: "UserPacking", uriExtension: 'uCirclePacking'},
        {id: "#streamgraph", classKey: "Streamgraph", uriExtension: 'htStreamgraph'}
      ]
    }
  }, function(err, html) {
      console.log(err);
      res.send(html);
  })

})

router.get('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page', function(req, res, next) {
  res.render('dashboard', { title: "R-Shief Dashboard" }, function(err, html) {
      console.log(err);
      res.send(html);
  })
})

router.put('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page', function (req, res, next) {
  console.log("session id is: " + req.sessionID);
  var result = Promise.resolve()
  .then(_ => { if (req.params.page == 0) return database.dePopulateSession(req.sessionID) })
  .then(_ => database.populateSession(req.sessionID, req.params))
  .then(success => res.sendStatus(200))
  .catch(failure => res.send(failure));
});

router.get('/:langList/:countryList/:sourceList/:startDate/:endDate/:hashtags/:usernames/:keywords/:page/:fetch', function (req, res, next) {
  console.log("got the request");
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
