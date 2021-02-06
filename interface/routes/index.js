var express = require('express');
var router = express.Router();
var axios = require('axios')
var multer = require('multer')
var fs = require('fs')

var upload = multer({dest:'uploads/'})

/* GET pagina inicial */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET pagina de registo de utilizador */
router.get('/registo',function(req,res,next){
    res.render('registo')
})

/* GET pagina de edicao de perfil de utilizador */
router.get('/editarPerfil',function(req,res,next){
     axios.get('http://localhost:7700/utilizador/' + req.cookies.email)
        .then(dados => res.render('editarPerfil', { uti : dados.data }))
        .catch(e => res.render('error',{error : e}))
})

/* GET Resource Form Page */
router.get('/recursoForm',function(req,res,next){
    axios.get('http://localhost:7800/recurso/tipos?token=' + req.cookies.token)
        .then(dados => res.render('recursoForm', { tipos: dados.data }))
        .catch(e => res.render('error', {error : e}))   
})

/* funcao de ordenacao de listas */
function dynamicSort(property){
    var sortOrder = 1;
    //ordenação decrescente
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result

        if (property == "likes")
            result = (a[property].length < b[property].length) ? -1 : (a[property].length > b[property].length) ? 1 : 0;
        else
            result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

        return result * sortOrder;
    }
}

/* GET pagina principal */
router.get('/recurso', function(req,res){
    axios.get('http://localhost:7800/recurso?token=' + req.cookies.token)
        .then(dados => {
            //para ordenar tipo/titulo/subtitulo.. quando se clica neles
            if(req.query.orderBy != null && req.query.orderBy != "")
                dados.data.sort(dynamicSort(req.query.orderBy))

            //search bar
            if(req.query.search != null && req.query.search != "" && req.query.searchBy != null && req.query.searchBy != ""){
                var aux = []

                dados.data.forEach(s => {
                    if(req.query.searchBy == "tipo"){
                        for(i = 0; i < s[req.query.searchBy].length; i++){
                            if(s[req.query.searchBy][i].includes(req.query.search)){
                                aux.push(s)
                                break
                            }
                        }
                    }

                    else if(s[req.query.searchBy].includes(req.query.search)){
                        aux.push(s)
                    }
                })

                dados.data = aux

                res.render('recursos', { lista: dados.data, nivel: req.cookies.nivel, email: req.cookies.email, search: req.query.search, searchBy: req.query.searchBy })
            }
            else
                res.render('recursos', { lista: dados.data, nivel: req.cookies.nivel, email: req.cookies.email })
        })
        .catch(e => res.render('error', {error : e}))
})

/* GET formulario para adicao de um tipo */
router.get('/tipoForm',function(req,res,next){
    axios.get('http://localhost:7800/recurso/tipos?token=' + req.cookies.token)
        .then(dados => res.render('recursoTipo', { tipos: dados.data }))
        .catch(e => res.render('error', {error : e}))   
})

/* GET Logout */
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

/* GET download de um ficheiro */
router.get('/recurso/download/:fname', function(req,res){
    res.download(__dirname + '/../public/fileStore/' + req.params.fname )
})

/* GET informação toda de um recurso */
router.get('/recurso/:id',function(req,res,next){
    axios.get('http://localhost:7800/recurso/' + req.params.id + '?token=' + req.cookies.token)
        .then(dados => res.render('recursoInfo', { recurso: dados.data, nivel: req.cookies.nivel, email: req.cookies.email }))
        .catch(e => res.render('error', {error : e}))   
})

/* POST pagina de registo */
router.post('/registo',function(req,res,next){
    var novoUti = req.body
    
    axios.post('http://localhost:7700/utilizador', novoUti)
        .then(() => res.redirect('/'))     
        .catch(err => res.status(500).render('error', {error : err}))   
})

/* POST editar Perfil */
router.post('/editarPerfil', function(req,res,next){
    var utiAtu = req.body

    axios.put('http://localhost:7700/utilizador/' + req.cookies.email, utiAtu)
        .then(() => res.redirect('/recurso'))    
        .catch(err => res.status(500).render('error', {error : err}))
})

/* POST pôr gosto no recurso */
router.post('/recurso/like/:id', function(req,res,next){
    axios.post('http://localhost:7800/recurso/like/' + req.params.id + '?token=' + req.cookies.token)
        .then(() => res.redirect('back'))    
        .catch(err => res.status(500).render('error', {error : err})) 

})

/* POST pôr comentário no recurso */
router.post('/recurso/comentario/:id', function(req,res,next){
    axios.post('http://localhost:7800/recurso/comentario/' + req.params.id + '?token=' + req.cookies.token, req.body)
        .then(() => res.redirect('back'))    
        .catch(err => res.status(500).render('error', {error : err})) 

})

/* POST pagina de submissao de um tipo */
router.post('/recurso/tipo',function(req,res,next){
    axios.post('http://localhost:7800/recurso/tipo?token=' + req.cookies.token, req.body)
        .then(() => res.redirect('/recurso'))    
        .catch(err => res.status(500).render('error', {error : err}))   
})

/* POST pagina de submissao de um recurso */
router.post('/recurso', upload.array('myfile',12), function(req,res){
    var novoRec = req.body

    axios.get('http://localhost:7700/utilizador/' + req.cookies.email)
        .then(dados => {
            var uti = dados.data

            novoRec.nomeProdutor = uti.nome
            novoRec.emailProdutor = uti.email
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

/* POST enviar as informacoes para login */
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
        .catch( () => res.redirect('/'))
});

/* POST apagar um comentário num recurso */
router.post('/recurso/comentario/apagar/:id', function(req, res, next){
    axios.delete('http://localhost:7800/recurso/comentario/apagar/' + req.params.id + '?token=' + req.cookies.token, {data: req.body})
        .then(() => res.redirect('back'))
        .catch(err => res.status(500).render('error', {error: err}))
})

/* POST administrador aprovar recurso */
router.post('/recurso/aprovar/:id', function(req, res, next){
    axios.put('http://localhost:7800/recurso/aprovar/' + req.params.id + '?token=' + req.cookies.token)
    .then(() => res.redirect('/recurso'))
    .catch(err => res.status(500).render('error', {error: err}))
})

/*POST apagar recurso (utiliza-se POST por causa do form do outro lado)*/
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