const mongoose = require('mongoose');

const fornecedorStatisticSchema = new mongoose.Schema({
  fornecedor: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: [
      'É requerido o fornecedor na qual os dados estatísticos pertecem'
    ]
  },
  qtTotalService: {
    type: Number,
    required: ['É requerida a quantidade total de servicos  por fornecedores']
  },
  qtActiveService: {
    type: Number,
    required: [
      'É requerida a quantidade total de servicos activos por fornecedores'
    ]
  },
  qtPendenteService: {
    type: Number,
    required: [
      'É requerida a quantidade total de servicos activos por fornecedores'
    ]
  },
  qtsolicitacao: { type: Number },
  solicitacoespendentes: { type: Number },
  solicitacoesConcluida: { type: Number }
});

fornecedorStatisticSchema.pre(/^find/, async function(next) {
  this.populate({
    path: 'fornecedor',
    select: 'name'
  });
  next();
});
const FornecedorStatistic = mongoose.model(
  'fornecedorstatistics',
  fornecedorStatisticSchema
);

module.exports = FornecedorStatistic;
