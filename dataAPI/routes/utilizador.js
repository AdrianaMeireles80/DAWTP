var express = require('express');
var router = express.Router();
//var bcrypt = require('bcryptjs')
var Utls = require('../controllers/utilizador');

/*
-> Users

      -> GET

	- users/login (Verificação de autenticação)

	- users/:id (Toda a informação de um utilizador)


      -> POST

	- users/ (Inserção de um utilizador)

      -> PUT

	- users/:id (Update de um utilizador)

	- users/:id/password (Update da password de um utilizador)

      -> DELETE
	
	- users/:id (Remoção de um utilizador)
*/

/*GET devolve utilizador com determinado id */
router.get('/:id', function(req,res,next){
    Utls.procurar(req.params.id)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)    
        })
})

/* GET login */

/*POST criação de um novo utilizador */
router.post('/',function(req,res,next){
    Utls.adicionar(req.body)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
        })
})

/*PUT modificar utilizador */
router.put('/:id',function(req,res,next){
    Utls.editar(req.params.id,req.body)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
        })
})

/*PUT modificar passe do utilizador */


/*DELETE apagar um utilizador */
router.delete('/:id',function(req,res,next){
    Utls.apagar(req.params.id)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
        })
})

module.exports = router;
