const mongoose  = require('mongoose');
const User    = require('./userModel')

const favoriteServiceSchema = new mongoose.Schema({
    user:{
        type: Object,
        required: true,
    },
    servicos:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Servico',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

favoriteServiceSchema.pre('save', async function(next){
    this.user     = await User.findById(this.user);
    next();
})

favoriteServiceSchema.pre(/^find/, async function(next){
    this.populate({
        path: 'servicos',
        select: 'name'
    })
    next();
})

const FavoriteService = mongoose.model('favoriteServices', favoriteServiceSchema);

module.exports = FavoriteService;