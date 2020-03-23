const mongoose = require('mongoose');
const Estado = require('./estadoModel');
const AppError = require('./../utils/appError');

const solicitacaoSchema = new mongoose.Schema({
    data:{
        type: Date,
    },
    estado:{
        type: Object,
        required: [true, 'Uma Solicitação deve ter uma Data'],
    },
    servico:{
        type: mongoose.Schema.ObjectId,
        Ref: 'servicos',
        required: [true, 'Uma Solicitação deve ter um serviço'],
    },
    cliente:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

solicitacaoSchema.pre('save', async function(next){
    this.estado    = await Estado.findOne({ estadoCode: {$eq: this.estado}});
    if(!this.estado) return next(new AppError('Missing Filds', 500));
    next();
})

solicitacaoSchema.pre(/^find/, async function(next){
    this.populate({path: 'servico'}).populate({path: 'cliente'})
    next();
})

const Solicitacao = mongoose.model('solicitacaos', solicitacaoSchema);

module.exports = Solicitacao;