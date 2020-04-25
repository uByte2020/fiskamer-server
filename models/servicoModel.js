const mongoose = require('mongoose');
const Estado = require('./estadoModel')
const Categoria = require('./categoriaModel')
const Pacote = require('./pacoteModel')
const AppError = require('./../utils/appError');

const servicoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: [true, 'Um Serviço deve ter um nome']
    },
    descricao:{
        type: String,
        default: ''
    },
    coverImage:{
        type: String,
        default: ''
    },
    images:{
        type: [String],
    },
    endereco:{
        type: [String],
        required: [true, 'Um Serviço deve ter um endereço']
    },
    estado:{
        type: Object,
        required: [true, 'Um Serviço deve ter um estado'],
    },
    categoria:{
        type: Object,
        required: true
    },
    pacote:{
        type: Object,
        required: true
    },
    fornecedor:{ 
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    pagamentos:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Pagamento',
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
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

servicoSchema.index({ location: '2dsphere' })

servicoSchema.pre('save', async function(next){
    this.categoria = await Categoria.findById(this.categoria);
    this.estado    = await Estado.findOne({ estadoCode: {$eq: this.estado}});
    this.pacote    = await Pacote.findById(this.pacote);

    if(!this.categoria) 
        return next(new AppError('Missing categoria', 400));
    if(!this.estado) 
        return next(new AppError('Missing estado', 400));
    if(!this.pacote) 
        return next(new AppError('Missing pacote', 400));
    
    next();
})

servicoSchema.pre(/^find/, async function(next){
    this.populate({path: 'fornecedor'});
    next();
})

const Servico = mongoose.model('servicos', servicoSchema);

module.exports = Servico;