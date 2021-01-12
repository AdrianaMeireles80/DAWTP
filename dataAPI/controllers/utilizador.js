var Utilizador = require('../models/utilizador')

//Retorna a lista de utilizadores
module.exports.listar = () => {
    return Utilizador.find().sort({nome:1}).exec()
}

module.exports.procurar = idutilizador => {
    return Utilizador.findOne({idutilizador: idutilizador}).exec()
}

module.exports.adicionar = utilizador => {
    //utilizador.password = bcrypt.hashSync(utilizador.password,6)
    var novoUti = new Utilizador(utilizador)
    return novoUti.save()
}

module.exports.apagar = idutilizador => {
    return Utilizador.findOneAndDelete({idutilizador: idutilizador}).exec()
}

module.exports.editar = (idutilizador,utilizador) =>{
    return Utilizador
            .findOneAndUpdate({idutilizador: idutilizador},{$set:{nome: utilizador.nome,filiacao: utilizador.filiacao,password:utilizador.password}})
            .exec()
}
