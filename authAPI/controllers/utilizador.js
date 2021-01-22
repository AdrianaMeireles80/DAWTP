var Utilizador = require('../models/utilizador')
var bcrypt = require('bcryptjs')

//Retorna a lista de utilizadores
module.exports.listar = () => {
    return Utilizador.find().sort({nome:1}).exec()
}

module.exports.procurar = email => {
    return Utilizador.findOne({email: email}).exec()
}

module.exports.adicionar = utilizador => {
    utilizador.password = bcrypt.hashSync(utilizador.password,6)
    utilizador.dataRegisto = new Date().toISOString().substring(0,10)
    utilizador.dataUltimoAcesso = new Date().toISOString().substring(0,10)
    var novoUti = new Utilizador(utilizador)
    return novoUti.save()
}

module.exports.apagar = email => {
    return Utilizador.findOneAndDelete({email: email}).exec()
}

module.exports.editar = (email,utilizador) =>{
    return Utilizador
            .findOneAndUpdate({email: email},{$set:{nome: utilizador.nome,filiacao: utilizador.filiacao,password:utilizador.password}})
            .exec()
}

module.exports.consultar = (e, callback) => {
    return Utilizador
     .findOne({email: e})
     .exec()
     .then(data => callback(null, data))
}