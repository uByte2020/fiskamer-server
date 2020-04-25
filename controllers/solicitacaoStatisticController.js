const solicitacaoStatistic = require('./../models/solicitacaoStatisticModel');
const catchAsync = require('../utils/catchAsync');

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
