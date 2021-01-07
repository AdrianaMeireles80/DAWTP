 
      
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

     //Get utilizador
     router.get('/:id',function(req,res,next){
       Recs.procurar(req.params.id)
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
          })
     })

     //Post novo utilizador
     router.post('/',function(req,res,next){
       Recs.adicionar(req.body)
          .then(dados => {
            res.jsonp(dados)
          })
          .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
          })
     })

     //Put atualizar utilizador
     router.put('/:id',function(req,res,next){
       Recs.editar(req.params.id,req.body)
          .then(dados => {
            res.jsonp(dados)
         })
          .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
          })
      })

      //Delete apagar utilizador
      router.delete('/:id',function(req,res,next){
        Recs.apagar(req.params.id)
           .then(dados => {
             res.jsonp(dados)
          })
           .catch(erro => {
             console.log(erro);
             res.status(500).jsonp(erro)
           })
       })
     