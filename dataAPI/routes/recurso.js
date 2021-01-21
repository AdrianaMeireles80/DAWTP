 
      
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

     var express = require('express');
     var router = express.Router();
     var Recs = require('../controllers/recurso');
     var Tipo = require('../controllers/tipo');
  
    /*
      0-Consumidor
      1- Produtor
      2- Administrador
    */

     router.get('/',function(req,res,next){
      Recs.listar()
         .then(dados => {
           res.jsonp(dados)
         })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

    router.get('/tipos',function(req,res,next){
      Tipo.listar()
         .then(dados => {
           res.jsonp(dados)
         })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

     //Get recurso
     router.get('/:id',function(req,res,next){
       Recs.procurar(req.params.id)
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
     })

     //Post novo recurso
     router.post('/',function(req,res,next){
       Recs.adicionar(req.body)
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
     })

    router.post('/tipo',function(req,res,next){
      Tipo.adicionar(req.body)
         .then(dados => {
           res.jsonp(dados)
         })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
    })

    router.put('/aprovar/:id',function(req,res,next){
      Recs.aprovar(req.params.id)
         .then(dados => {
           res.jsonp(dados)
        })
         .catch(erro => {
           res.status(500).jsonp(erro)
         })
     })

     //Put atualizar recurso
     router.put('/:id',function(req,res,next){
       Recs.editar(req.params.id,req.body)
          .then(dados => {
            res.jsonp(dados)
         })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
      })

      //Delete apagar recurso
      router.delete('/:id',function(req,res,next){
        Recs.apagar(req.params.id)
           .then(dados => {
             res.jsonp(dados)
          })
           .catch(erro => {
             res.status(500).jsonp(erro)
           })
       })
       
 module.exports = router;
     