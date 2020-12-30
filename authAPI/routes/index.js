var express = require('express');
var router = express.Router();

var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/protected',verifyingAuthentication, function(req,res) {
  res.render('protected',{utilizador: req.user.id})
})

function verifyingAuthentication(req,res,next){
  if(req.isAuthenticated()){
    next();
  } else{
    res.redirect("/users/login")
  }
}

module.exports = router;
