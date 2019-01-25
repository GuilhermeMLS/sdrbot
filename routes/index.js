var express = require('express');
var router = express.Router();

const sdrbot = require("./sdrbot.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  // var data = sdrbot.sdrmain();

  sdrbot.sdrmain(function(data) {
    res.render('index', {
      data
    });
  });

  
  // var t = "SDRBot Alpha 1.1";
  // var s = "www.ebanx.com";
  // if (req.query.site) {
  //   s = req.query.site;
  // }

  // sdrbot.sdrmain().then(res.render('index'),{
  //   title: t,
  //   site: s
  // });

  

  

  // res.render('index', { 
  //   title: t,
  //   site: s,
  //   data: data
  // });
});

module.exports = router;
