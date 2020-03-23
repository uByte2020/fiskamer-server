const Service = require('./../models/servicoModel');
const factory = require('./handlerFactory')
const AppError = require('./../utils/appError');

exports.aliasTopServices = (req, res, next) => {
    req.query.limit = '10';
    // req.query.sort = '-ratingsAverage, price';
    // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

const filterObj = (obj, ...allowedFields) => {
    
    const newObj = {};
    
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    
    return newObj;
}

const isRequiredFields = (obj, ...reqFields)=>{
    const fildObj        = Object.keys(obj);

    reqFields.forEach(el => {
        if(!fildObj.includes(el)) return false;
    });
    return true;
}

exports.validateFilds = (req, res, next) => {

    if(!isRequiredFields(req.body, 'nome', 'endereco', 'pacote', 'fornecedor', 'coverImage', 'categoria'))
        return next(new AppError('Missing Required Fields', 400));

    const fieldsBody = Object.keys(req.body);
    
    if(fieldsBody.includes('features')){
        const {features}    = req.body;
        const newFeatures   = [];

        features.forEach(fe => {
            if(isRequiredFields(fe, 'feature', 'price'))
                newFeatures.push(filterObj(fe, 'feature', 'price'))
        })

        req.body.price      = null;
        req.body.features   = newFeatures;
        
        return next();
    }

    if(!fieldsBody.includes('price')) return next(new AppError('Missing Required Fields', 400));

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
