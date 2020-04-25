const userStatistic = require('./../models/userStatisticModel');
const catchAsync = require('../utils/catchAsync');

exports.getStatisticUsers = catchAsync(async (req, res, next) => {
  const doc = await userStatistic.find();
  res.status(200).json({
    status: 'success',
    data: {
      data: doc[doc.length - 1]
    }
  });
});
