var User = require('../models/user')

//Retorna a lista de utilizadores
module.exports.listar = () => {
    return User
            .find()
            .sort({nome:1})
            .exec()
}

module.exports.procurar = id => {
    return User
            .findOne({iduser: id})
}

module.exports.adicionar = utilizador => {
    utilizador.password = bcrypt.hashSync(utilizador.password,6)
    var novoUti = new User(utilizador)
    return novoUti.save()
}

module.exports.apagar = id => {
    return User
            .findOneAndDelete({iduser: id})
            .exec()
}

module.exports.editar = utilizador =>{
    return User
            .findOneAndUpdate({iduser: utilizador.iduser},{$set:{nome: utilizador.nome,filiacao: utilizador.filiacao,password:utilizador.password}})
            .exec()
}
