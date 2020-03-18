const Service = require('./../models/servicoModel');
const factory = require('./handlerFactory')

exports.aliasTopServices = (req, res, next) => {
    req.query.limit = '10';
    // req.query.sort = '-ratingsAverage, price';
    // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

//Verificar Pagamento Antes de Criar servico - METODO INCOMPLETO
exports.verifyPayment = (req, res, next) => { 
    req.body.estado = 0
    if(req.body.payment) req.body.estado = 1
    next();
}

exports.getService          = factory.getOne(Service);
exports.getAllServices      = factory.getAll(Service);
exports.createService       = factory.createOne(Service);
exports.updateService       = factory.updateOne(Service);
exports.deleteService       = factory.deleteOne(Service);
