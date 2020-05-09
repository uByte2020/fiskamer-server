/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const favoriteServiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  servicos: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'servicos'
      }
    ],
    required: true,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

favoriteServiceSchema.pre(/^find/, async function(next) {
  this.populate({
    path: 'servicos',
    select: 'nome'
  });
  next();
});

const FavoriteService = mongoose.model(
  'favoriteServices',
  favoriteServiceSchema
);

module.exports = FavoriteService;
