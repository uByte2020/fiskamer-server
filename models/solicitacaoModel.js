const mongoose = require('mongoose');
const Estado = require('./estadoModel')

const solicitacaoSchema = new mongoose.Schema({
    data:{
        type: Date,
        required: [true, 'Solicitação deve ter uma data']
    },
    estado:{
        type: Object,
        required: [true, 'Uma Solicitação deve ter uma Data'],
    },
    servico:{
        type: mongoose.Schema.ObjectId,
        Ref: 'Servico',
        required: [true, 'Uma Solicitação deve ter um serviço'],
    },
    cliente:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

solicitacaoSchema.pre('save', async function(next){
    this.estado  = await Estado.findById(this.estado);
    next();
})

const Solicitacao = mongoose.model('solicitacaos', solicitacaoSchema);

module.exports = Solicitacao;