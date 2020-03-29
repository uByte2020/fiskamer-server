const multer        = require('multer');
const sharp         = require('sharp');
const User          = require('./../models/userModel');
const catchAsync    = require('./../utils/catchAsync');
const AppError      = require('./../utils/appError');
const factory       = require('./handlerFactory')

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if(!req.file) return next();

    req.body.photo = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/users/${req.body.photo}`);
    
    next();
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.updateMe = catchAsync(async(req, res) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return new AppError('This route is not for password updates. Please use /updateMyPassword', 400)
    }

    const filtedObect = filterObj(req.body, 'name', 'email', 'role', 'telemovel', 'endereco');

    if(req.file) filtedObect.photo = req.body.photo
    // 2) Update the user document
    const user = await User.findByIdAndUpdate(req.user.id, filtedObect, { 
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data:{
            user
        }
    });
});

exports.deleteMe = catchAsync(async(req, res) => {
    // 2) Update the user document
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getAllUsers     = factory.getOne(User);
exports.getUser         = factory.getAll(User);
exports.createUser      = factory.createOne(User);
exports.updateUser      = factory.updateOne(User);
exports.deleteUser      = factory.deleteOne(User);

