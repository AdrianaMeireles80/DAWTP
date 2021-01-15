var express = require('express');
const passport = require('passport');
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
router.get('/:email', function(req,res,next){
    Utls.procurar(req.params.email)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)    
        })
})

/* GET login */
router.post('/login', passport.authenticate('local'),function(req,res){
    jwt.sign({email: req.utilizador.email, password: req.utilizador.password},
        "DAWTP2020",
        {expiresIn: 1800},
        function(e,token){
            if(e) res.status(500).jsonp({error: "Erro na geração do token" + e})
            else res.status(201).jsonp({token: token})
        });
})

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
router.put('/:email',function(req,res,next){
    Utls.editar(req.params.email,req.body)
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
router.delete('/:email',function(req,res,next){
    Utls.apagar(req.params.email)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)
        })
})

module.exports = router;
