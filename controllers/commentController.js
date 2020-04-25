const Comment = require('../models/commentModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.validateData = (req, res, next) => {
  req.body.user = req.user.id;
  if (!req.body.servico) req.body.servico = req.params.servicoId;
  next();
};

exports.getComments = catchAsync(async (req, res, next) => {
  const doc = await Comment.findOne({ servico: req.params.servicoId });
  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
