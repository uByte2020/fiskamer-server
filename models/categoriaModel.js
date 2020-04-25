const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'A Categoria deve ter uma descrição']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Categoria = mongoose.model('categorias', categoriaSchema);

module.exports = Categoria;
