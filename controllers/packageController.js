const Package= require('../models/pacoteModel')
const factory = require('./handlerFactory')

exports.getAllPackage       = factory.getOne(Package);
exports.getPackage          = factory.getAll(Package);
exports.createPackage       = factory.createOne(Package);
exports.updatePackage       = factory.updateOne(Package);
exports.deletePackage       = factory.deleteOne(Package);