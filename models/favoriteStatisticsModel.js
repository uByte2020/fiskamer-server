const mongoose = require('mongoose');

const favoriteStatisticSchema = new mongoose.Schema({
  ocorrenciaFavoritos: {
    type: Object,
    ref: 'servicos'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const favoriteStatistic = mongoose.model(
  'favoritestatistics',
  favoriteStatisticSchema
);
module.exports = favoriteStatistic;
