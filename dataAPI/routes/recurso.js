var express = require('express');
var multer = require('multer')
var fs = require('fs')
var zipper = require('zip-local')
var router = express.Router();
var Recs = require('../controllers/recurso');
var Tipo = require('../controllers/tipo');

var upload = multer({dest:'uploads/'})

/* funcao que verifica se um utilizador tem permissao para executar uma operacao */
function checkPermissao(acess){
    return function(req, res, next){
        if(acess == 0 || req.app.get('utilizador').nivel >= acess){ // req.app.get('utilizador').nivel - recebe o nível do ficheiro 'app.js'
            next()
        }
        else{
            res.status(401).jsonp("Não tem permissão")
        }
    }
}   

/* GET devolve todos os recursos a que um utilizador tem acesso */
router.get('/', checkPermissao(0), function(req,res,next){
    Recs.listar(req.app.get('utilizador'))
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* GET devolve todos os tipos */
router.get('/tipos', checkPermissao(1), function(req,res,next){     
    Tipo.listar()
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* GET download de um ficheiro */
router.get('/download/:fname', checkPermissao(0), function(req, res){
    var oldPath = __dirname + '/../public/fileStore/' + req.params.fname.replace(/\.zip/g, "")
    var newPath = __dirname + '/../public/fileStore/' + req.params.fname

    //criacao do zip do recurso
    zipper.sync.zip(oldPath).compress().save(newPath)
    
    res.download(newPath, (err) => {
        if(!err){
            fs.unlink(newPath, (err) =>{
                if(err){
                    res.status(500).render('error', {error: err})
                }
            })
        }
    })
})

/* GET devolve um recurso */
router.get('/:id', checkPermissao(0), function(req,res,next){
    Recs.procurar(req.params.id, req.app.get('utilizador'))
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* POST adicionar um recurso */
router.post('/', upload.single('myfile'), checkPermissao(1), function(req,res,next){

    var novoRec = req.body
    novoRec.nomeFicheiro = req.file.originalname
    novoRec.tipo = JSON.parse(novoRec.tipo)

    let oldPath = __dirname + '/../' + req.file.path
    let newPath = __dirname + '/../public/fileWaiting/' + req.file.originalname

    fs.rename(oldPath,newPath,function(err){
        if(err)
            throw err

        else {
            Recs.adicionar(novoRec)
                .then(dados => {
                    res.jsonp(dados)
                })
                .catch(erro => {
                    res.status(500).jsonp(erro)
                })
        } 
    })
})

/* POST adicionar um tipo */
router.post('/tipo', checkPermissao(2), function(req,res,next){
    Tipo.adicionar(req.body)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* POST adicionar um like a um recurso */
router.post('/like/:id', checkPermissao(0), function(req,res,next){
    Recs.adicionarLike(req.params.id, req.app.get('utilizador').email, function(err, data) {
        if (err){
            next(err)
        }
        else if (data){
            res.status(201).jsonp(data)
        }
    })
})

/* POST adicionar um comentario a um recurso */
router.post('/comentario/:id', checkPermissao(0), function(req,res,next){
    Recs.adicionarComentario(req.params.id, req.app.get('utilizador').nome, req.body.comentario)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* PUT aprovacao de um recurso por um administrador */
router.put('/aprovar/:id', checkPermissao(2), function(req,res,next){
    let oldPath = __dirname + '/../public/fileWaiting/' + req.body.nomeFicheiro
    let newPath = __dirname + '/../public/fileStore/' + req.body.nomeFicheiro.replace(/\.zip/g, "")

    fs.mkdir(newPath, (err) => { 
        if (err) { 
            res.status(500).render('error', {error: err}) 
        }
        else{

            console.log(oldPath + "\n" + newPath)
        
            zipper.sync.unzip(oldPath).save(newPath)
        
            console.log("fiz unzip")
        
            Recs.aprovar(req.params.id)
                .then(dados => {
                    fs.unlink(oldPath, (err) =>{
                        if(err){
                            res.status(500).render('error', {error: err})
                        }
                        else
                            res.jsonp(dados)
                    })
                })
                .catch(erro => {
                    res.status(500).jsonp(erro)
                })
        }
    })
})

/* PUT atualizacao de um recurso */
router.put('/:id', checkPermissao(1), function(req,res,next){
    Recs.editar(req.params.id,req.body, req.app.get('utilizador'))
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* DELETE apagar um comentario de um recurso */
router.delete('/comentario/apagar/:id', checkPermissao(1), function(req, res, next){
    Recs.apagarComentario(req.params.id, req.body.nome, req.body.comentario, req.app.get('utilizador'))
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* DELETE apagar um recurso nao aprovado*/
router.delete('/naoaprovar/:id', checkPermissao(2), function(req,res,next){
    Recs.apagar(req.params.id, req.app.get('utilizador'))
        .then(dados => {
            var path = __dirname + '/../public/fileWaiting/' + dados.nomeFicheiro
            fs.unlink(path, (err) =>{
                if(err){
                    res.status(500).render('error', {error: err})
                }
                else
                    res.jsonp(dados)
            })
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

/* DELETE apagar um recurso */
router.delete('/:id', checkPermissao(1), function(req,res,next){
    Recs.apagar(req.params.id, req.app.get('utilizador'))
        .then(dados => {
            var path = __dirname + '/../public/fileStore/' + dados.nomeFicheiro.replace(/\.zip/g, "")
            fs.rmdir(path, { recursive: true }, (err) =>{
                if(err){
                    res.status(500).render('error', {error: err})
                }
                else
                    res.jsonp(dados)
            })
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

 module.exports = router;