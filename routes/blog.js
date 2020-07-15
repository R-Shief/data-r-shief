var express = require('express');
var router = express.Router();
var fs = require('fs');
var md = require("markdown-it")({html: true, linkify: true, typographer: true});

var hljs = require('highlight.js'); // https://highlightjs.org/

// Actual default values
var md = require('markdown-it')({
  html: true, linkify: true, typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

//router.use(express.json());

router.get('/', function(req, res, next) {
  const posts = fs.readdirSync(__dirname + '/../public/blog').filter(file => file.endsWith('.md'));
  res.render('blog', {posts: posts});
});

router.get('/:article', function(req, res, next) {
  const file = fs.readFile(__dirname + '/../public/blog/' + req.params.article + '.md', 'utf8', function(err, data) {
    if (err) throw err;
    var result = md.render(data);
    console.log(result);
    res.render('post', {post: result});
  });
});

router.post('/submit', function(req, res, next) {
  console.log("got here");
  console.log(req.body);

});

module.exports = router;
