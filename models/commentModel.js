const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  servico: {
    type: mongoose.Schema.ObjectId,
    ref: 'servicos',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

commentSchema.pre(/^find/, async function(next) {
  this.populate('servico').populate('user');
  next();
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
