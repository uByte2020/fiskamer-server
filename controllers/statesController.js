const State = require('../models/estadoModel');
const factory = require('./handlerFactory');

exports.getState = factory.getOne(State);
exports.getAllStates = factory.getAll(State);
exports.createState = factory.createOne(State);
exports.updateState = factory.updateOne(State);
exports.deleteState = factory.deleteOne(State);
