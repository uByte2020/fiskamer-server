const mongoose = require('mongoose');
const Estado = require('./estadoModel')
const Categoria = require('./categoriaModel')
const Pacote = require('./pacoteModel')
const AppError = require('./../utils/appError');

const servicoSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: [true, 'Um Serviço deve ter um nome'],
        unique: true
    },
    descricao:{
        type: String,
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
        ref: 'User',
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
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

servicoSchema.pre('save', async function(next){
    this.categoria = await Categoria.findById(this.categoria);
    this.estado    = await Estado.findOne({ estadoCode: {$eq: this.estado}});
    this.pacote    = await Pacote.findById(this.pacote);

    if(!this.categoria || !this.estado || !this.pacote) 
        return next(new AppError('Missing Filds', 500));
    
    next();
})

const Servico = mongoose.model('servicos', servicoSchema);

module.exports = Servico;