/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const Estado = require('./estadoModel');
const AppError = require('./../utils/appError');
const StatisticSolicitacao = require('./solicitacaoStatisticModel');
const FornecedorStatistica = require('./fornecedorStatisticModel');
const Servico = require('./servicoModel');
const ErrorMessage = require('./../utils/error');

const solicitacaoSchema = new mongoose.Schema({
  data: {
    type: Date
  },
  estado: {
    type: Object,
    required: [true, 'Uma Solicitação deve ter uma Data']
  },
  servico: {
    type: mongoose.Schema.ObjectId,
    ref: 'servicos',
    required: [true, 'Uma Solicitação deve ter um serviço']
  },
  cliente: {
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

solicitacaoSchema.pre('save', async function(next) {
  this.estado = await Estado.findOne({ estadoCode: { $eq: this.estado } });
  if (!this.estado) return next(new AppError(ErrorMessage[17].message, 500));
  next();
});

solicitacaoSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'cliente' }).populate({ path: 'servico' });
  next();
});

const createStatisticSolicitacao = async function() {
  await StatisticSolicitacao.deleteMany();
  const qtSolicitacaoTotal = await Solicitacao.find().count();
  const qtSolicitacaoPendente = await Solicitacao.find({
    'estado.estadoCode': 3
  }).count();
  const qtSolicitacaoCancelada = await Solicitacao.find({
    'estado.estadoCode': 4
  }).count();
  const qtSolicitacaoConcluida = await Solicitacao.find({
    'estado.estadoCode': 5
  }).count();
  const ocorrenciaServico = await Solicitacao.aggregate([
    { $match: { 'estado.estadoCode': { $ne: 4 } } }
  ])
    .group({ _id: '$servico', storeQt: { $sum: 1 } })
    .sort({ storeQt: -1 });
  const ocorrenciaCliente = await Solicitacao.aggregate([
    { $group: { _id: '$cliente', storeQt: { $sum: 1 } } }
  ]).sort({ storeQt: -1 });

  await StatisticSolicitacao.create({
    qtSolicitacaoTotal: qtSolicitacaoTotal,
    qtSolicitacaoPendente: qtSolicitacaoPendente,
    qtSolicitacaoConcluida: qtSolicitacaoConcluida,
    qtSolicitacaoCancelada: qtSolicitacaoCancelada,
    ocorrenciaServico: ocorrenciaServico,
    ocorrenciaCliente: ocorrenciaCliente
  });
};

const createFornecedorStatistic = async function(idServico) {
  if (idServico) {
    const storeQuery = await Servico.find({ _id: idServico });
    const { fornecedor } = storeQuery[0];
    const arrayServices = await Servico.find({ fornecedor: fornecedor }).select(
      '_id'
    );
    const qtsolicitacao = await Solicitacao.find({
      servico: arrayServices
    }).count();
    const solicitacoespendentes = await Solicitacao.find({
      servico: arrayServices,
      'estado.estadoCode': 3
    }).count();
    const solicitacoesConcluida = await Solicitacao.find({
      servico: arrayServices,
      'estado.estadoCode': 5
    }).count();

    await FornecedorStatistica.findOneAndUpdate(
      { fornecedor: fornecedor },
      {
        qtsolicitacao: qtsolicitacao,
        solicitacoespendentes: solicitacoespendentes,
        solicitacoesConcluida: solicitacoesConcluida
      },
      { new: true, runValidators: true, upsert: true }
    );
  }
};

solicitacaoSchema.post('save', async function(next) {
  createStatisticSolicitacao();
  createFornecedorStatistic(this.servico);
});

solicitacaoSchema.post(/^find/, async function(Solicitacao, next) {
  createStatisticSolicitacao();
  createFornecedorStatistic(Solicitacao.servico);
});

const Solicitacao = mongoose.model('solicitacoes', solicitacaoSchema);

module.exports = Solicitacao;
