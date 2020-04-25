const fornecedorStatistic = require('./../models/fornecedorStatisticModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllStatisticFornecedor = factory.getAll(fornecedorStatistic);
exports.getStatisticFornecedor = catchAsync(async (req, res, next) => {
  const doc = await fornecedorStatistic.find({ fornecedor: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});
