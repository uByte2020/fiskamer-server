const SubCategoria = require('../models/subCategoriaModel');
const factory = require('./handlerFactory');

exports.getSubCategoria = factory.getOne(SubCategoria);
exports.getAllSubCategorias = factory.getAll(SubCategoria);
exports.createSubCategoria = factory.createOne(SubCategoria);
exports.updateSubCategoria = factory.updateOne(SubCategoria);
exports.deleteSubCategoria = factory.deleteOne(SubCategoria);
