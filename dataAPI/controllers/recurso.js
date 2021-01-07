var Recurso = require('../models/user')

//Retorna a lista de utilizadores
module.exports.listar = () => {
    return Recurso
            .find()
            .sort({tipo:1})
            .exec()
}

module.exports.procurar = id => {
    return Recurso
            .findOne({idrec: id})
}

module.exports.adicionar = rec => {    
    var novoRec = new Recurso(rec)
    return novoRec.save()
}

module.exports.apagar = id => {
    return Recurso
            .findOneAndDelete({idrec: id})
            .exec()
}

module.exports.editar = (id,rec) =>{
    return Recurso
            .findOneAndUpdate(id,{$set:{subtitulo: rec.subtitulo,visibilidade: rec.visibilidade}})
            .exec()
}
