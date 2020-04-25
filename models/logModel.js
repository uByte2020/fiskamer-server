const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  new_registro: {
    type: String,
    default: ' '
  },
  old_registro: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Um log deve ter um user'],
    ref: 'User'
  },
  operacao: {
    type: String,
    required: [true, 'Um log deve ter uma operação']
  },
  data: {
    type: Date,
    default: Date.now(),
    required: [true, 'Um log deve ter uma data']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Log = mongoose.model('logs', logSchema);

module.exports = Log;
