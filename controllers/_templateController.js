const _template= require('../models/_templateModel')
const factory = require('./handlerFactory')

exports.getAll_template       = factory.getOne(_template);
exports.get_template          = factory.getAll(_template);
exports.create_template       = factory.createOne(_template);
exports.update_template       = factory.updateOne(_template);
exports.delete_template       = factory.deleteOne(_template);