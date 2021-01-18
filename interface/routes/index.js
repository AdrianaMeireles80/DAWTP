var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/*GET Login Page */
router.get('/login', function(req,res){
  res.render('login')
})

/*GET Resource Page */
router.get('/recurso', function(req,res){
  axios.get('http://localhost:7800/recurso?token=' + req.cookies.token)
    .then(dados => res.render('recursos', { lista : dados.data}))
    .catch(e => res.render('error', {error : e}))
})


/*POST Login Page */
router.post('/login', function(req,res){
  axios.post('http://localhost:7700/utilizador/login', req.body)
    .then(dados => {
      res.cookie('token',dados.data.token, {
        expires: new Date(Date.now() + '1d'),
        secure: false,
        httpOnly: true
      })
      res.redirect('/recurso')
    })
    .catch(e => res.render('error', {error : e }))
});

module.exports = router;
