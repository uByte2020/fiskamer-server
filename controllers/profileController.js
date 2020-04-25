const Profile = require('../models/perfilModel');
const factory = require('./handlerFactory');

exports.getProfile = factory.getOne(Profile);
exports.getAllProfiles = factory.getAll(Profile);
exports.createProfile = factory.createOne(Profile);
exports.updateProfile = factory.updateOne(Profile);
exports.deleteProfile = factory.deleteOne(Profile);
