const Solicitacao = require('../models/solicitacaoModel');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getMySolicitations = (req, res, next) => {
  req.query.cliente = req.user.id;
  next();
};

exports.getUserSolicitations = (req, res, next) => {
  if (req.params.clientId) req.query.cliente = req.params.clientId;
  next();
};

exports.validateData = (req, res, next) => {
  if (!req.body.servico) req.body.servico = req.params.servicoId;
  if (!req.body.cliente) req.body.cliente = req.user.id;
  req.body.data = new Date(req.body.data);
  req.body.estado = 3;
  next();
};

exports.getClientesByFornecedor = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Solicitacao.find(), req.query)
    .sort()
    .limitFields()
    .paginate();

  const docsTemp = await features.query;

  const docs = docsTemp
    .filter(doc => {
      return doc.servico.fornecedor._id.toString() === req.params.fornecedoId;
    })
    .map(doc => doc.cliente);

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      docs
    }
  });
});

exports.getSolicitacao = factory.getOne(Solicitacao);
exports.getAllSolicitacao = factory.getAll(Solicitacao);
exports.createSolicitacao = factory.createOne(Solicitacao);
exports.updateSolicitacao = factory.updateOne(Solicitacao);
exports.deleteSolicitacao = factory.deleteOne(Solicitacao);
