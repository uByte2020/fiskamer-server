const multer        = require('multer');
const sharp         = require('sharp');
const Service = require('./../models/servicoModel');
const factory = require('./handlerFactory')
const AppError = require('./../utils/appError');
const catchAsync    = require('./../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image'))
        cb(null, true)
    else
        cb(new AppError('Only images ara allowed', 400), false);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadServicePhoto = upload.fields([
    { name: 'coverImage',   maxCount: 1 },
    { name: 'images',       maxCount: 10}
])

exports.resizeServicePhoto = catchAsync(async (req, res, next) => {
    
    if(!req.files) return next();

    if(req.files.coverImage){
        req.body.coverImage = `service-${req.params.id}-${Date.now()}-cover.jpeg`

        await sharp(req.files.coverImage[0].buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/services/${req.body.coverImage}`);
    }
    
    if(req.files.images){
        req.body.images = []

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `service-${req.params.id}-${Date.now()}-${i}.jpeg`
                
                await sharp(file.buffer)
                        .resize(2000, 1333)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(`public/img/services/${filename}`);
                
                req.body.images.push(filename);
            })
        );
    }

    next();
});

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
