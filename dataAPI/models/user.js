var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    iduser: String,
    nome: String,
    email: String,
    filiacao: String,
    nivel: Number,
    dataRegisto: Date,
    dataUltimoAcesso: Date ,
    password :String

})

module.exports = mongoose.model('user',userSchema)
