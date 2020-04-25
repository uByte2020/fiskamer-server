const mongoose = require('mongoose');

const serviceStatisticSchema = new mongoose.Schema({
  qtServiceTotal: {
    type: Number,
    required: [
      'É requerida a quantidade total de serviços registados no sistema'
    ]
  },
  qtServiceActivo: {
    type: Number,
    required: [
      'É requerida a quantidade total de serviços com o estado de divulgação Activo'
    ]
  },
  qtServicePendente: {
    type: Number,
    required: [
      'É requerida a quantidade total de serviços com o estado de divulgação Pendente'
    ]
  },
  qtServiceVencido: {
    type: Number,
    required: [
      'É requerida a quantidade total de serviços com o estado de divulgação Vencido/Expirado'
    ]
  },
  ocorrenciaCategoria: {
    type: Object,
    required: ['É requerida a categoria com mais serviço divulgado']
  },
  ocorrenciaPacote: {
    type: [Object],
    required: [
      'É requerida a pacote mais requisitado na divulgação de servicos'
    ]
  },
  ocorrenciaFornecedor: {
    type: Object,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const ServiceStatistic = mongoose.model(
  'servicestatistics',
  serviceStatisticSchema
);
module.exports = ServiceStatistic;
