const mongoose = require('mongoose');

const subCategoriaSchema = new mongoose.Schema({
  subCategoria: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const subCategoria = mongoose.model('subCategorias', subCategoriaSchema);

module.exports = subCategoria;
