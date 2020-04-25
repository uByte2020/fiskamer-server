const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  // like: {
  //     type: Number,
  //     required: true,
  //     default: 0
  // },
  servico: {
    type: mongoose.Schema.ObjectId,
    ref: 'Servico',
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

commentSchema.pre('save', async function(next) {
  this.populate('servico').populate('user');
  next();
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
