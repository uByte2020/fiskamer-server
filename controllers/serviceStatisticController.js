const serviceStatistic = require('./../models/serviceStatisticModel');
const catchAsync = require('../utils/catchAsync');

exports.getStatisticService = catchAsync(async (req, res, next) => {
  const doc = await serviceStatistic
    .find()
    .populate({ path: 'ocorrenciaFornecedor._id', select: 'name' });
  res.status(200).json({
    status: 'success',
    data: {
      data: doc[doc.length - 1]
    }
  });
});
