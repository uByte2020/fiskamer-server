const mongoose = require('mongoose');

const reacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['like', 'not-like']
  },
  servico: {
    type: mongoose.Schema.ObjectId,
    ref: 'servicos',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

reacaoSchema.pre(/^find/, async function(next) {
  this.populate('servico').populate('user');
  next();
});

const Reacao = mongoose.model('reacoes', reacaoSchema);

module.exports = Reacao;
