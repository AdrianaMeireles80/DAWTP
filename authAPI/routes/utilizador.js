var express = require('express');
const passport = require('passport');
var router = express.Router();
//var bcrypt = require('bcryptjs')
var Utls = require('../controllers/utilizador');
var jwt = require('jsonwebtoken')
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
function checkPermissao(acesso){
    return function(req, res, next) {
    if(acesso == 0 || req.utilizador.nivel>=acesso){
      console.log("Tem permissão")
      next()
    }
    else{
    console.log("Não tem permissão")
    res.status(401).jsonp("Não tem permissão")
    }
    }
  }

  /*
    0-Consumidor
    1- Produtor
    2- Administrador
  */

/*GET devolve todos os utilizadores */
router.get('/' ,function(req,res,next){
    Utls.listar()
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)    
        })
})

/*GET devolve utilizador com determinado id */
router.get('/:email',function(req,res,next){
    Utls.procurar(req.params.email)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).jsonp(erro)    
        })
})

/* POST login */
router.post('/login', passport.authenticate('local'),function(req,res){
    jwt.sign({email: req.body.email, password: req.body.password},
        "DAWTP2020",
        {expiresIn: 1800},
        function(e,token){
            if(e) res.status(500).jsonp({error: "Erro na geração do token" + e})
            else {
                Utls.procurar(req.body.email)
                    .then(dados => {
                        res.status(201).jsonp({token: token, nivel: dados.nivel, email: req.body.email })
                    })
                    .catch(erro => {
                        console.log(erro);
                        res.status(500).jsonp(erro)    
                    })
            }
        });
})

/*POST criação de um novo utilizador */
router.post('/',function(req,res,next){
    Utls.consultar(req.body.email, function(err, util) {
        if (err) {
          next(err)
        }
        else if (util) {
            res.status(406).jsonp({error: "Email já existente"})
        }
        else {
            Utls.adicionar(req.body)
                .then(dados => {
                    res.status(201).jsonp(dados)
                })
                .catch(erro => {
                    res.status(500).jsonp({error: erro})
                })
        }
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
