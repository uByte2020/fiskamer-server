const Solicitacao= require('../models/solicitacaoModel')
const factory = require('./handlerFactory')

exports.getAllSolicitacao       = factory.getOne(Solicitacao);
exports.getSolicitacao          = factory.getAll(Solicitacao);
exports.createSolicitacao       = factory.createOne(Solicitacao);
exports.updateSolicitacao       = factory.updateOne(Solicitacao);
exports.deleteSolicitacao       = factory.deleteOne(Solicitacao);