var express = require('express');
var router = express.Router();

/* GET website data. */
router.get('/', function(req, res, next) {
  var t = "SDRBot Alpha 1.1";
  var s = "www.ebanx.com";
  if (req.query.site) {
    s = req.query.site;
  }
//res.algumacoisa
});

module.exports = router;
