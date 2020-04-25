const logModel = require('../models/logModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getLog = factory.getAll(logModel);
exports.deleteLog = factory.deleteOne(logModel);
exports.getAllLog = catchAsync(async (req, res) => {
  const docs = await logModel.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      data: docs
    }
  });
});
