/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const Estado = require('./estadoModel');
const Categoria = require('./categoriaModel');
const Pacote = require('./pacoteModel');
const AppError = require('./../utils/appError');
const ServiceStatistic = require('./serviceStatisticModel');
const ProviderStatistic = require('./fornecedorStatisticModel');
const ErrorMessage = require('./../utils/error');

const servicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Um Serviço deve ter um nome']
  },
  descricao: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: 'default.jpg'
  },
  images: {
    type: [String]
  },
  endereco: {
    type: [String],
    required: [true, 'Um Serviço deve ter um endereço']
  },
  estado: {
    type: Object,
    required: [true, 'Um Serviço deve ter um estado']
  },
  categoria: {
    type: Object,
    required: true
  },
  pacote: {
    type: Object,
    required: true
  },
  fornecedor: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  pagamentos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'pagamentos'
      // required: true
    }
  ],
  price: {
    type: Number,
    default: null
  },
  features: {
    type: [Object],
    default: null
  },
  classification: {
    type: Number,
    default: 4.5,
    max: 5,
    min: 1
  },
  like: {
    type: Number,
    default: 0
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      default: [-80.185942, 25.774772]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

servicoSchema.index({ location: '2dsphere' });

servicoSchema.pre('save', async function(next) {
  this.categoria = await Categoria.findById(this.categoria);
  this.estado = await Estado.findOne({ estadoCode: { $eq: this.estado } });
  this.pacote = await Pacote.findById(this.pacote);

  if (!this.categoria) return next(new AppError(ErrorMessage[21].message, 400));
  if (!this.estado) return next(new AppError(ErrorMessage[22].message, 400));
  if (!this.pacote) return next(new AppError(ErrorMessage[23].message, 400));

  next();
});

const createServiceStatistic = async function() {
  await ServiceStatistic.deleteMany();

  const qtServiceTotal = await Servico.find().count();

  const qtServiceActivo = await Servico.find({
    'estado.estadoCode': 1
  }).count();

  const qtServicePendente = await Servico.find({
    'estado.estadoCode': 0
  }).count();

  const qtServiceVencido = await Servico.find({
    'estado.estadoCode': 6
  }).count(); //Serviços com prazo de divulgação vencido

  const ocorrenciaCategoria = await Servico.aggregate([
    {
      $match: {
        $or: [
          { 'estado.estadoCode': { $eq: 1 } },
          { 'estado.estadoCode': { $eq: 6 } }
        ]
      }
    }
  ])
    .group({ _id: '$categoria', storeQt: { $sum: 1 } })
    .sort({ storeQt: -1 });
  const ocorrenciaPacote = await Servico.aggregate([
    {
      $match: {
        $or: [
          { 'estado.estadoCode': { $eq: 1 } },
          { 'estado.estadoCode': { $eq: 6 } }
        ]
      }
    }
  ])
    .group({ _id: '$pacote', storeQt: { $sum: 1 } })
    .sort({ storeQt: -1 });
  const ocorrenciaFornecedor = await Servico.aggregate([
    {
      $match: {
        $or: [
          { 'estado.estadoCode': { $eq: 1 } },
          { 'estado.estadoCode': { $eq: 6 } }
        ]
      }
    }
  ])
    .group({ _id: '$fornecedor', storeQt: { $sum: 1 } })
    .sort({ storeQt: -1 });

  await ServiceStatistic.create({
    qtServiceTotal: qtServiceTotal,
    qtServiceActivo: qtServiceActivo,
    qtServicePendente: qtServicePendente,
    qtServiceVencido: qtServiceVencido,
    ocorrenciaCategoria: ocorrenciaCategoria,
    ocorrenciaPacote: ocorrenciaPacote,
    ocorrenciaFornecedor: ocorrenciaFornecedor
  });
};

const createFornecedorStatistic = async function(fornecedorId) {
  if (fornecedorId) {
    const qtTotalService = await Servico.find({
      fornecedor: fornecedorId
    }).count();
    const qtActiveService = await Servico.find({
      fornecedor: fornecedorId,
      'estado.estadoCode': 1
    }).count();
    const qtPendenteService = await Servico.find({
      fornecedor: fornecedorId,
      'estado.estadoCode': 3
    }).count();
    await ProviderStatistic.findOneAndUpdate(
      { fornecedor: fornecedorId },
      {
        qtTotalService: qtTotalService,
        qtActiveService: qtActiveService,
        qtPendenteService: qtPendenteService
      },
      { new: true, runValidators: true, upsert: true }
    );
  }
};

servicoSchema.post('save', async function(next) {
  createServiceStatistic();
  createFornecedorStatistic(this.fornecedor);
});

servicoSchema.post(/^find/, async function(Servico, next) {
  createServiceStatistic();
  createFornecedorStatistic(Servico.fornecedor);
});

servicoSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'fornecedor' });
  next();
});

const Servico = mongoose.model('servicos', servicoSchema);

module.exports = Servico;
