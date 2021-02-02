var express = require('express');
var router = express.Router();
var axios = require('axios')
var multer = require('multer')
var fs = require('fs')

var upload = multer({dest:'uploads/'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/*GET Register Page */
router.get('/registo',function(req,res,next){
  res.render('registo')
})

/*GET Resource Form Page */
router.get('/recursoForm',function(req,res,next){
  axios.get('http://localhost:7800/recurso/tipos?token=' + req.cookies.token)
    .then(dados => res.render('recursoForm', { tipos: dados.data }))
    .catch(e => res.render('error', {error : e}))  
})

/*GET Resource Page */
router.get('/recurso', function(req,res){
  axios.get('http://localhost:7800/recurso?token=' + req.cookies.token)
    .then(dados => res.render('recursos', { lista: dados.data, nivel: req.cookies.nivel, email: req.cookies.email }))
    .catch(e => res.render('error', {error : e}))
})

/*GET Type Form Page */
router.get('/tipoForm',function(req,res,next){
  axios.get('http://localhost:7800/recurso/tipos?token=' + req.cookies.token)
    .then(dados => res.render('recursoTipo', { tipos: dados.data }))
    .catch(e => res.render('error', {error : e}))  
})

router.get('/logout', function(req, res){
  res.cookie('token', "", {
    expires: new Date(Date.now() + '1s'),
    secure: false,
    httpOnly: true
  })
  //Obter o nivel de acesso
  res.cookie('nivel', "", {
    expires: new Date(Date.now() + '1s'),
    secure: false,
    httpOnly: true
  })
  //Obter o email para saber o produtor que adicionou o recurso
  res.cookie('email', "", {
    expires: new Date(Date.now() + '1s'),
    secure: false,
    httpOnly: true
  })
  res.redirect('/')
})

router.get('/recurso/download/:fname', function(req,res){
  res.download(__dirname + '/../public/fileStore/' + req.params.fname )
})

/*POST Register Page */
router.post('/registo',function(req,res,next){
  var novoUti = req.body
  
  axios.post('http://localhost:7700/utilizador', novoUti)
    .then(() => res.redirect('/'))   
    .catch(err => res.status(500).render('error', {error : err}))  
})

/*POST New Type */
router.post('/recurso/tipo',function(req,res,next){
  axios.post('http://localhost:7800/recurso/tipo?token=' + req.cookies.token, req.body)
    .then(() => res.redirect('/recurso'))   
    .catch(err => res.status(500).render('error', {error : err}))  
})

/*POST Resource */
router.post('/recurso', upload.array('myfile',12), function(req,res){
  var novoRec = req.body

  axios.get('http://localhost:7700/utilizador/' + req.cookies.email)
    .then(dados => {
      var uti = dados.data

      novoRec.nomeProdutor = uti.nome
      novoRec.emailProdutor = uti.email
      
      console.log("REQFILES " + JSON.stringify(req.files))
      req.files.forEach(reqfile => {
    
        novoRec.nomeFicheiro = reqfile.originalname
        let oldPath = __dirname + '/../' + reqfile.path
        let newPath = __dirname + '/../public/fileStore/' + reqfile.originalname

        fs.rename(oldPath,newPath,function(err){
          if(err)
            throw err

          else {
            axios.post('http://localhost:7800/recurso?token=' + req.cookies.token, novoRec)
              .then(() =>{
                res.redirect('/recurso')
              })
              .catch(err => res.status(500).render('error', {error: err}))
          }
        })
      })
    })
    .catch(e => res.render('error', {error : e}))
})

/*POST Login Page */
router.post('/login', function(req,res){
  axios.post('http://localhost:7700/utilizador/login', req.body)
    .then(dados => {
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '30m'),
        secure: false,
        httpOnly: true
      })
      //Obter o nivel de acesso
      res.cookie('nivel', dados.data.nivel, {
        expires: new Date(Date.now() + '30m'),
        secure: false,
        httpOnly: true
      })
      //Obter o email para saber o produtor que adicionou o recurso
      res.cookie('email', dados.data.email, {
        expires: new Date(Date.now() + '30m'),
        secure: false,
        httpOnly: true
      })
      res.redirect('/recurso')
    })
    .catch(e => res.render('error', {error : e }))
});

router.post('/recurso/aprovar/:id', function(req, res, next){
  axios.put('http://localhost:7800/recurso/aprovar/' + req.params.id + '?token=' + req.cookies.token)
  .then(() => res.redirect('/recurso'))
  .catch(err => res.status(500).render('error', {error: err}))
})

/*DELETE delete resource */
router.post('/recurso/:id',function(req,res,next){
  axios.delete('http://localhost:7800/recurso/' + req.params.id + '?token=' + req.cookies.token)
    .then(dados =>{
      var path = __dirname + '/../public/fileStore/' + dados.data.nomeFicheiro
      fs.unlink(path, (err) =>{
        if(err){
          res.status(500).render('error', {error: err})
        }
        else
          res.redirect('/recurso')
      })      
    })
    .catch(err => res.status(500).render('error', {error: err}))
})

module.exports = router;
