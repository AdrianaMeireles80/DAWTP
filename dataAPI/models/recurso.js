var mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    idrec: String,
    tipo: String,
    titulo: String,
    subtitulo: String,
    dataCriacao: Date,
    dataRegisto: Date,
    visibilidade: Boolean
})

module.exports = mongoose.model('recurso',recursoSchema)