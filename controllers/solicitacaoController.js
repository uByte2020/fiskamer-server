const Solicitacao = require('../models/solicitacaoModel');
const factory = require('./handlerFactory');

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

exports.getSolicitacao = factory.getOne(Solicitacao);
exports.getAllSolicitacao = factory.getAll(Solicitacao);
exports.createSolicitacao = factory.createOne(Solicitacao);
exports.updateSolicitacao = factory.updateOne(Solicitacao);
exports.deleteSolicitacao = factory.deleteOne(Solicitacao);
