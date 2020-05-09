const solicitacaoStatistic = require('./../models/solicitacaoStatisticModel');
const catchAsync = require('../utils/catchAsync');
const StatisticSolicitacao = require('./../models/solicitacaoStatisticModel');
const FornecedorStatistica = require('./../models/fornecedorStatisticModel');
const Servico = require('./../models/servicoModel');
const Solicitacao = require('./../models/solicitacaoModel');

exports.getStatisticSolicitacao = catchAsync(async (req, res, next) => {
  const doc = await solicitacaoStatistic.find().populate([
    { path: 'ocorrenciaCliente._id', select: 'name' },
    { path: 'ocorrenciaServico._id', select: 'nome' }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: doc[doc.length - 1]
    }
  });
});

exports.createStatisticSolicitacao = async function() {
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

exports.createFornecedorStatistic = async function(idServico) {
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
