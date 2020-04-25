const Category = require('../models/categoriaModel');
const factory = require('./handlerFactory');

exports.getCategorie = factory.getOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.createCotegory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
