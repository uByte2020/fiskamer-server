const FavoriteService   = require('../models/favoriteServiceModel')
const catchAsync        = require('../utils/catchAsync');
const factory           = require('./handlerFactory');


exports.addToFavorites=catchAsync(async(req,res)=>{ 
    const doc = await FavoriteService.updateOne({'user.id': req.user.id}, {$push:{servicos:req.body.servico}}, {
        new:            true, //Para devolver o documento actualizado
        runValidators:  true
    });
    res.status(200).json({
        status: 'success',
        data: { 
            data: doc
        }
    })
})

exports.getAllFavoriteService       = factory.getOne(FavoriteService);
exports.getFavoriteService          = factory.getAll(FavoriteService);
exports.createFavoriteService       = factory.createOne(FavoriteService);
exports.updateFavoriteService       = factory.updateOne(FavoriteService);
exports.deleteFavoriteService       = factory.deleteOne(FavoriteService);