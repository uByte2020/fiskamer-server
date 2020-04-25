const Package = require('../models/pacoteModel');
const factory = require('./handlerFactory');

exports.getAllPackage = factory.getAll(Package);
exports.getPackage = factory.getOne(Package);
exports.createPackage = factory.createOne(Package);
exports.updatePackage = factory.updateOne(Package);
exports.deletePackage = factory.deleteOne(Package);
