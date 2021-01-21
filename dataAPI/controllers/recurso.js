var Recurso = require('../models/recurso')

//Retorna a lista de utilizadores
module.exports.listar = () => {
    return Recurso
            .find()
            .sort({titulo:1})
            .exec()
}

module.exports.procurar = id => {
    return Recurso
            .findOne({_id: id})
}

module.exports.adicionar = rec => {  
    rec.dataRegisto = new Date().toISOString().substring(0,10)
    rec.validado = false
    
    var novoRec = new Recurso(rec)
    
    return novoRec.save()
}

module.exports.apagar = id => {
    return Recurso
            .findOneAndDelete({_id: id})
            .exec()
}

module.exports.aprovar = id =>{
    return Recurso
            .findOneAndUpdate({_id: id},{$set:{validado: "true"}})
            .exec()
}

module.exports.editar = (id,rec) =>{
    return Recurso
            .findOneAndUpdate({_id: id},{$set:{tipo: rec.tipo,visibilidade: rec.visibilidade}})
            .exec()
}
