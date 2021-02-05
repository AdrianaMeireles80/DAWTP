 
      
      /*
      -> GET

      - recursos/:id
  
  
        -> POST
  
      - recursos/
  
        -> PUT
  
      - recursos/:id 
  
        -> DELETE
      
      - recursos/:id

      */

function checkPermissao(acess){
  return function(req, res, next) {
    if(acess == 0 || req.app.get('utilizador').nivel >= acess){ // req.app.get('utilizador').nivel - recebe o nível do ficheiro 'app.js'
      console.log("Tem permissão")
      next()
    }
    else{
      console.log("Não tem permissão")
      res.status(401).jsonp("Não tem permissão")
    }
  }
}

     var express = require('express');
     var router = express.Router();
     var Recs = require('../controllers/recurso');
     var Tipo = require('../controllers/tipo');
  
    /*
      0-Consumidor
      1- Produtor
      2- Administrador
    */

     router.get('/',checkPermissao(0),function(req,res,next){
      Recs.listar(req.app.get('utilizador'))
         .then(dados => {
           res.jsonp(dados)
         })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

    router.get('/tipos',checkPermissao(1),function(req,res,next){    
      Tipo.listar()
         .then(dados => {
           res.jsonp(dados)
         })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

     //Get recurso
     router.get('/:id',checkPermissao(0),function(req,res,next){
       Recs.procurar(req.params.id, req.app.get('utilizador'))
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
     })

     //Post novo recurso
     router.post('/',checkPermissao(1),function(req,res,next){
       Recs.adicionar(req.body)
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
     })

    router.post('/tipo',checkPermissao(2),function(req,res,next){
      Tipo.adicionar(req.body)
         .then(dados => {
           res.jsonp(dados)
         })

         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

    router.post('/like/:id',checkPermissao(0), function(req,res,next){
      console.log(JSON.stringify(req.body.email))
      Recs.adicionarLike(req.params.id, req.body.email, function(err, data) {
        if (err) {
          next(err)
        }
        else if (data) {
          res.status(201).jsonp(data)
        }
      })
    })
     
    //para o administrador aprovar a inserção de novos recursos
    router.put('/aprovar/:id',checkPermissao(2),function(req,res,next){
      Recs.aprovar(req.params.id)
         .then(dados => {
           res.jsonp(dados)
        })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
     })

     //Put atualizar recurso
     router.put('/:id',checkPermissao(1),function(req,res,next){
       Recs.editar(req.params.id,req.body, req.app.get('utilizador'))
          .then(dados => {
            res.jsonp(dados)
         })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
      })

      //Delete apagar recurso
      router.delete('/:id',checkPermissao(1),function(req,res,next){
        Recs.apagar(req.params.id, req.app.get('utilizador'))
           .then(dados => {
             res.jsonp(dados)
          })
           .catch(erro => {
             res.status(500).jsonp(erro)
           })
       })
       
 module.exports = router;
     