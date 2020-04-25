const mongoose = require('mongoose');

const solicitacaoStatisticSchema = new mongoose.Schema({
  qtSolicitacaoTotal: {
    type: Number,
    required: [
      'É requerida a quantidade total de solicitações registados no sistema'
    ]
  },
  qtSolicitacaoPendente: {
    type: Number,
    required: [
      'É requerida a quantidade total de solicitações com estado pendente'
    ]
  },
  qtSolicitacaoConcluida: {
    type: Number,
    required: [
      'É requerida a quantidade total de solicitações com estado Concluido'
    ]
  },
  qtSolicitacaoCancelada: {
    type: Number,
    required: [
      'É requerida a quantidade total de solicitações com estado Cancelada'
    ]
  },
  ocorrenciaServico: {
    type: Object,
    ref: 'servicos',
    required: ['É requerido o serviço n1 mais solicitado pelos clientes']
  },
  ocorrenciaCliente: {
    type: Object,
    ref: 'users',
    required: ['É requerido o cliente que mais solicitou serviço']
  }
});

const solicitacaoStatistic = mongoose.model(
  'solicitacaostatistics',
  solicitacaoStatisticSchema
);
module.exports = solicitacaoStatistic;
