const AppError      = require('../utils/appError');
const catchAsync    = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures')

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    const docs = await features.query;

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data:{
            data: docs
        }
    });
});

exports.getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});


exports.createOne  = Model => catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: data
        }
    })
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new:            true, //Para devolver o documento actualizado
        runValidators:  true
    });
    res.status(200).json({
        status: 'success',
        data: { 
            data: doc
        }
    })
});

exports.deleteOne = Model => catchAsync(async(req, res, next) => {
    
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document found with that id', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
});