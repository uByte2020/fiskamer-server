/* eslint-disable camelcase */
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const ErrorMessage = require('./../utils/error');
const Log = require('../models/logModel');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs
      }
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.createLogs = (user, model, oldRegistro, newRegistro, operacao) => {
  Log.create({
    newRegistro: newRegistro,
    oldRegistro: oldRegistro,
    user: user,
    operacao: `${operacao} ${model.modelName.substr(
      0,
      model.modelName.length - 1
    )}`
  });
};

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    this.createLogs(req.user.id, Model, null, doc, req.method);
    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // eslint-disable-next-line camelcase
    const old_doc = await Model.findById(req.params.id);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //Para devolver o documento actualizado
      runValidators: true
    });
    this.createLogs(req.user.id, Model, old_doc, doc, req.method);
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const old_doc = await Model.findById(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(ErrorMessage[13].message, 404));
    }
    this.createLogs(req.user.id, Model, old_doc, null, req.method);
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
