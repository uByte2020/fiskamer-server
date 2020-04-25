const mongoose  = require('mongoose');
const StatisticFvorite = require('./favoriteStatisticsModel')
const favoriteServiceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    servicos:{
        type: [mongoose.Schema.ObjectId],
        ref: 'servicos',
        required: true,
        default: []
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});
/*
favoriteServiceSchema.pre(/^find/, async function(next){
    this.populate({
        path: 'servicos',
        select: 'name'
    })
    next();
})
*/
favoriteServiceSchema.post(/^find/, async function(next){
    await StatisticFvorite.deleteMany();
    const ocorrenciaFavoritos =await FavoriteService.aggregate([{$unwind:"$servicos"}]).group({_id:"$servicos",storeQt:{$sum:1}}).sort({storeQt:-1})
 
    await  StatisticFvorite.create({
        ocorrenciaFavoritos:ocorrenciaFavoritos
      })
}); 

const FavoriteService = mongoose.model('favoriteServices', favoriteServiceSchema);

module.exports = FavoriteService;