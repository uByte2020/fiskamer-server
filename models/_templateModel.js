const mongoose  = require('mongoose');
const Estado    = require('./estadoModel')

const _templateSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true
    },
    estado:{
        type: Object,
        required: true,
    },
    parceiro:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fotos:[String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

_templateSchema.pre('save', async function(next){
    this.estado     = await Estado.findById(this.estado);
    next();
})
_templateSchema.pre('save', async function(next){
    this.populate({
        path: '_template',
        select: 'name'
    })
    next();
})

const _template = mongoose.model('_templates', _templateSchema);

module.exports = _template;