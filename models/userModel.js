/* eslint-disable no-use-before-define */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Perfil = require('./perfilModel');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');
// mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A User must have a name']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'A User must have a email'],
    unique: [true, 'A email must have unique'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  telemovel: {
    type: String,
    trim: true,
    unique: [true, 'Um telemovel deve ser unique'],
    validate: function(tel) {
      const RegExp = /^([+]?244){0,1}\s{0,1}9([1-4]|9)[0-9]{1}\s{0,1}[0-9]{3}\s{0,1}[0-9]{3}$/g;
      return RegExp.test(tel);
    }
  },
  endereco: {
    type: [String],
    trim: true
  },
  photo: {
    type: String,
    trim: true,
    default: 'default.jpg'
  },
  role: {
    type: Object,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Please provide a password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, 'Please confirm a password'],
    validate: {
      //This only works on SAVE and CREATE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now()
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  secretUser: {
    type: Boolean,
    default: false
  }
});

userSchema.pre(/^find/, function(next) {
  // In Query Middleware, 'this' reference to query befere be executed
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function(next) {
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(this.role)) {
    this.role = await Perfil.findOne({ perfilCode: { $eq: this.role } });
    if (!this.role) return next(new AppError(ErrorMessage[0].message, 500));
  }
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1;
  next();
});

userSchema.methods.correctPassword = async function(candidatePwd, userPdw) {
  return await bcrypt.compare(candidatePwd, userPdw);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const chagedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < chagedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Conversão de horas para segundos, e de segundos para milisegundos
  this.passwordResetExpires = Date.now() + 24 * 3600 * 1000;

  return resetToken;
};

const User = mongoose.model('users', userSchema);

module.exports = User;
