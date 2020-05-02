const mongoose = require('mongoose');
const Estado = require('./estadoModel');

const planejamentoSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: [true, 'Solicitação deve ter uma data']
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  estado: {
    type: Object,
    required: [true, 'Uma Solicitação deve ter uma Data']
  },
  solicitacoes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Solicitacao',
      default: []
    }
  ],
  price: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

planejamentoSchema.pre('save', async function(next) {
  this.estado = await Estado.findById(this.estado);
  next();
});

const Planejamento = mongoose.model('planejamentos', planejamentoSchema);

module.exports = Planejamento;
