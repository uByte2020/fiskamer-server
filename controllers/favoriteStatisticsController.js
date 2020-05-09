const favoriteStatistic = require('./../models/favoriteStatisticsModel');
const catchAsync = require('../utils/catchAsync');
const StatisticFvorite = require('./../models/favoriteStatisticsModel');
const FavoriteService = require('./../models/favoriteServiceModel');

exports.getStatisticFavorite = catchAsync(async (req, res) => {
  const doc = await favoriteStatistic
    .find()
    .populate({ path: 'ocorrenciaFavoritos._id', select: 'nome' });
  res.status(200).json({
    status: 'success',
    data: {
      data: doc[doc.length - 1]
    }
  });
});

exports.favoriteServiceSchema = async function(next) {
  await StatisticFvorite.deleteMany();

  const ocorrenciaFavoritos = await FavoriteService.aggregate([
    { $unwind: '$servicos' }
  ])
    .group({ _id: '$servicos', storeQt: { $sum: 1 } })
    .sort({ storeQt: -1 });

  await StatisticFvorite.create({
    ocorrenciaFavoritos: ocorrenciaFavoritos
  });
};
