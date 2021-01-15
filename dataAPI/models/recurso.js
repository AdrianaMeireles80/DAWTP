var mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
   
    tipo: {type: [String], required:true},
    titulo: {type: String, required:true},
    subtitulo: String,
    dataCriacao: Date,
    dataRegisto: Date,
    visibilidade: Boolean
})

module.exports = mongoose.model('recurso',recursoSchema)