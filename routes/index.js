var express = require('express');
var router = express.Router();

const sdrbot = require('./sdrbot');

/* GET home page. */
router.get('/', function(req, res, next) {
  var s = "ebanx.com.br";
  if (req.query.site) {
    s = req.query.site;
  }
  sdrbot({ domain: s }).then(function (data) {
      res.render('index', { data });
  })

});

router.get('/search', function(req, res, next) {
  var s = "ebanx.com.br";
  if (req.query.site) {
    s = req.query.site;
  }
  sdrbot({ domain: s }).then(function (data) {
      res.render('search', { data });
  })

});

module.exports = router;
