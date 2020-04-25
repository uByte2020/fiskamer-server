const mongoose = require('mongoose');

const pacoteSchema = new mongoose.Schema({
  pacote: {
    type: String,
    trim: true,
    required: [true, 'A Pacote deve ter um Nome']
  },
  descricao: {
    type: String,
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'A Pacote deve ter um preço']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const pacote = mongoose.model('pacotes', pacoteSchema);

module.exports = pacote;
