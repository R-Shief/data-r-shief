var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "RShief Archive Viewer", keywords: ['Express', 'foo', 'bar'], languages: {en: 'English', fr: 'French', es: 'Spanish', it: "Italian", de: "German", ar: "Arabic"} });
});

module.exports = router;
