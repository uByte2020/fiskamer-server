const favoriteStatistic = require('./../models/favoriteStatisticsModel')
const catchAsync       = require('../utils/catchAsync');

exports.getStatisticFavorite = catchAsync(async (req, res) => {
    const doc = await favoriteStatistic.find().populate({path: "ocorrenciaFavoritos._id",select: 'nome'});
       res.status(200).json({
        status: 'success',
        data: {
             data: doc[doc.length-1]
        }
    })
});
