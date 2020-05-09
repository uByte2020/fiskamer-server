const multer = require('multer');
const sharp = require('sharp');
const Service = require('./../models/servicoModel');
const Reacao = require('./../models/reactionModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const ErrorMessage = require('./../utils/error');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError(ErrorMessage[14].message, 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadServicePhoto = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

exports.resizeServicePhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.coverImage) {
    req.body.coverImage = `service-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/services/${req.body.coverImage}`);
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `service-${req.params.id}-${Date.now()}-${i}.jpeg`;

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
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const isRequiredFields = (obj, ...reqFields) => {
  const fildObj = Object.keys(obj);

  reqFields.forEach(el => {
    if (!fildObj.includes(el)) return false;
  });
  return true;
};

exports.validateFilds = (req, res, next) => {
  if (
    !isRequiredFields(
      req.body,
      'nome',
      'endereco',
      'pacote',
      'fornecedor',
      'coverImage',
      'categoria'
    )
  ) {
    return next(new AppError(ErrorMessage[15].message, 400));
  }

  const fieldsBody = Object.keys(req.body);

  if (fieldsBody.includes('features')) {
    const { features } = req.body;
    const newFeatures = [];

    features.forEach(fe => {
      if (isRequiredFields(fe, 'feature', 'price'))
        newFeatures.push(filterObj(fe, 'feature', 'price'));
    });

    req.body.price =
      req.body.price || newFeatures.reduce((total, current) => total + current);
    req.body.features = newFeatures;

    return next();
  }

  if (!fieldsBody.includes('price'))
    return next(new AppError(ErrorMessage[15].message, 400));

  next();
};

//Verificar Pagamento Antes de Criar servico - METODO INCOMPLETO
exports.verifyPayment = (req, res, next) => {
  req.body.estado = 1;

  if (req.body.payment) req.body.estado = 2;

  next();
};

// '/within/:distance/center/:coordenates'
exports.getServicesWithin = catchAsync(async (req, res, next) => {
  const { distance, coordenates } = req.params;
  const [latitude, longitude] = coordenates.split(',');

  if (!latitude || !longitude) {
    return next(new AppError(ErrorMessage[20].message));
  }

  const radius = distance / 6378.1;

  const services = await Service.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
});

exports.getServicesbyCategoria = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Service.find({ 'categoria.categoria': req.params.categoria }),
    req.query
  )
    .sort()
    .limitFields()
    .paginate();

  const docs = await features.query;

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: {
      docs
    }
  });
});

// '/distance/:coordenates'
exports.getServicesDistances = catchAsync(async (req, res, next) => {
  const { coordenates } = req.params;
  const [latitude, longitude] = coordenates.split(',');

  if (!latitude || !longitude) {
    return next(new AppError(ErrorMessage[20].message));
  }

  const services = await Service.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordenates: [longitude, latitude]
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
});

exports.getSerciveByFornecedor = (req, res, next) => {
  if (req.params.fornecedorId) req.query.fornecedor = req.params.fornecedorId;
  next();
};

exports.like = catchAsync(async (req, res, next) => {
  const servico = await Service.findById(req.params.id).select('like');
  let reacao = await Reacao.findOne({
    user: req.user.id,
    servico: req.params.id
  });

  if (!reacao) {
    reacao = { user: req.user.id, servico: req.params.id };
    reacao.tipo = 'like';
    req.body.like = servico.like + 1;
    await Reacao.create(reacao);
    next();
  }

  reacao.tipo = reacao.tipo === 'like' ? 'not-like' : 'like';
  if (reacao.tipo === 'like') req.body.like = servico.like + 1;
  else req.body.like = servico.like - 1;

  await Reacao.findByIdAndUpdate(reacao._id, reacao);
  next();
});

exports.addDisponibilidade = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.disponibilidades)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Service.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { disponibilidades: req.body.disponibilidades } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true,
      upsert: true
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.removeDisponibilidade = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.body.disponibilidade)
    return next(new AppError(ErrorMessage[12].message, 400));

  const doc = await Service.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { disponibilidades: req.body.disponibilidade } },
    {
      new: true, //Para devolver o documento actualizado
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getService = factory.getOne(Service);
exports.getAllServices = factory.getAll(Service);
exports.createService = factory.createOne(Service);
exports.updateService = factory.updateOne(Service);
exports.deleteService = factory.deleteOne(Service);
