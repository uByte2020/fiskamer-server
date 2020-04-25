const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
  entidade: {
    type: String,
    required: [true, 'A Pagamento deve ter uma entidade']
  },
  referencia: {
    type: String,
    required: [true, 'A Pagamento deve ter uma referencia']
  },
  valor: {
    type: Number,
    required: [true, 'A Pagamento deve ter um valor']
  },
  dataPagamento: {
    type: Date,
    default: Date.now(),
    required: [true, 'A Pagamento deve ter um data de pagamento']
  },
  dataCaducidade: {
    type: Date,
    required: [true, 'A Pagamento deve ter um data de caducidade']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Pagamento = mongoose.model('pagamentos', pagamentoSchema);

module.exports = Pagamento;
