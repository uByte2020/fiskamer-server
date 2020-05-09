const FavoriteService = require('../models/favoriteServiceModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');

exports.addToFavorites = catchAsync(async (req, res, next) => {
  if (req.params.servicoId) req.body.servico = req.params.servicoId;

  if (!req.body.servico)
    return next(new AppError(ErrorMessage[12].message, 400));

  const oldDoc = await FavoriteService.find({ user: req.user.id });
  const doc = await FavoriteService.findOneAndUpdate(
    { user: req.user.id },
    { $addToSet: { servicos: req.body.servico } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true,
      upsert: true
    }
  );
  factory.createLogs(
    req.user.id,
    FavoriteService,
    oldDoc.toString(),
    doc,
    req.method
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.removeFromFavorites = catchAsync(async (req, res, next) => {
  if (req.params.servicoId) req.body.servico = req.params.servicoId;
  const oldDoc = await FavoriteService.find({ user: req.user.id });
  const doc = await FavoriteService.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { servicos: req.body.servico } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true
    }
  );
  factory.createLogs(
    req.user.id,
    FavoriteService,
    oldDoc.toString(),
    doc,
    req.method
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getMyFavoriteService = (req, res, next) => {
  req.query.user = req.user.id;
  next();
};

exports.getUserFavoriteService = (req, res, next) => {
  if (req.params.userId) req.query.user = req.params.userId;
  next();
};

exports.getFavoriteService = factory.getOne(FavoriteService);
exports.getAllFavoriteService = factory.getAll(FavoriteService);
// exports.createFavoriteService       = factory.createOne(FavoriteService);
// exports.updateFavoriteService       = factory.updateOne(FavoriteService);
exports.deleteFavoriteService = factory.deleteOne(FavoriteService);
