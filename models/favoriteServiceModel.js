const mongoose  = require('mongoose');

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

favoriteServiceSchema.pre(/^find/, async function(next){
    this.populate({
        path: 'servicos',
        select: 'name'
    })
    next();
})

const FavoriteService = mongoose.model('favoriteServices', favoriteServiceSchema);

module.exports = FavoriteService;