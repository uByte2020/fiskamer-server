const Category = require('../models/categoriaModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const ErrorMessage = require('./../utils/error');

exports.addSubCategoria = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.subCategorias)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { subCategorias: req.body.subCategorias } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true,
      upsert: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.removeSubCategoria = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.subCategoria)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { subCategorias: req.body.subCategoria } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getCategorie = factory.getOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.createCotegory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
