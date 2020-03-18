const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    categoria:{
        type: String,
        required: [true, 'A Categoria deve ter uma descrição']
    },
    categoriaCode:{
        type: Number,
        required: [true, 'A Categoria deve ter um code'],
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Categoria = mongoose.model('categorias', categoriaSchema);

module.exports = Categoria;