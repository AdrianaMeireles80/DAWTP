var Recurso = require('../models/recurso')

//Retorna a lista de utilizadores
module.exports.listar = utilizador => {
    if (utilizador.nivel == 0){
        return Recurso
            .find({visibilidade: true, validado: true})
            .sort({titulo:1})
            .exec()

    } else if (utilizador.nivel == 1){
        return Recurso
            .find({$or: [
                            {visibilidade: true, validado: true},
                            {emailProdutor: utilizador.email, validado: true}
                        ]})
            .sort({titulo:1})
            .exec()
        
    } else if (utilizador.nivel == 2){
        return Recurso
            .find()
            .sort({titulo:1})
            .exec()
    }
}

module.exports.procurar = (id, utilizador) => {
    if (utilizador.nivel == 0){
        return Recurso
            .findOne({_id: id, visibilidade: true, validado: true})

    } else if (utilizador.nivel == 1){
        return Recurso
            .findOne({$and: [
                                {_id: id},
                                {$or: [
                                        {visibilidade: true, validado: true},
                                        {emailProdutor: utilizador.email, validado: true}
                                    ]}
                                ]})
        
    } else if (utilizador.nivel == 2){
        return Recurso
            .findOne({_id: id})
    }
}

module.exports.adicionar = rec => {  
    rec.dataRegisto = new Date().toISOString().substring(0,10)
    rec.validado = false
    
    var novoRec = new Recurso(rec)
    
    return novoRec.save()
}

module.exports.apagar = (id, utilizador) => {
    if(utilizador.nivel == 1){
        return Recurso
                .findOneAndDelete({_id: id, emailProdutor: utilizador.email})
                .exec()
    }
    else if(utilizador.nivel == 2){
        return Recurso
                .findOneAndDelete({_id: id})
                .exec()
    }
}

module.exports.aprovar = id =>{
    return Recurso
            .findOneAndUpdate({_id: id},{$set:{validado: "true"}})
            .exec()
}

module.exports.editar = (id, rec, utilizador) =>{
    if(utilizador.nivel == 1){
        return Recurso
                .findOneAndUpdate({_id: id, emailProdutor: utilizador.email},{$set:{tipo: rec.tipo, visibilidade: rec.visibilidade}})
                .exec()
    }
    else if(utilizador.nivel == 2){
        return Recurso
                .findOneAndUpdate({_id: id},{$set:{tipo: rec.tipo, visibilidade: rec.visibilidade}})
                .exec()
    }
}
