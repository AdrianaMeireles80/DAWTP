var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({

    nome: {type:String, required: true},
    email: {type: String, required:true},
    filiacao: String,
    nivel: {type:String, required:true},
    dataRegisto: Date,
    dataUltimoAcesso: Date ,
    password :{type: String, required:true}

})


module.exports = mongoose.model('utilizador',userSchema)
