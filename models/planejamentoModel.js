const mongoose = require('mongoose');
const Estado = require('./estadoModel')

const planejamentoSchema = new mongoose.Schema({
    data:{
        type: Date,
        required: [true, 'Solicitação deve ter uma data']
    },
    estado:{
        type: Object,
        required: [true, 'Uma Solicitação deve ter uma Data'],
    },
    solicitacaos:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Solicitacao'
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

planejamentoSchema.pre('save', async function(next){
    this.estado  = await Estado.findById(this.estado);
    next();
})

const Planejamento = mongoose.model('planejamentos', planejamentoSchema);

module.exports = Planejamento;