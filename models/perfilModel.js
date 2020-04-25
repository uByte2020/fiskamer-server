const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
  perfil: {
    type: String,
    required: [true, 'Um perfil deve ter a usa descrição']
  },
  perfilCode: {
    type: Number,
    required: [true, 'Um perfil deve ter um Code'],
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Perfil = mongoose.model('perfils', perfilSchema);

module.exports = Perfil;
