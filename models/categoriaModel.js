const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: [true, 'A Categoria deve ter uma descrição'],
    unique: true
  },
  subCategorias: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'subCategorias'
      }
    ],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

categoriaSchema.pre(/^find/, async function(next) {
  this.populate('subCategorias');
  next();
});

const Categoria = mongoose.model('categorias', categoriaSchema);

module.exports = Categoria;
