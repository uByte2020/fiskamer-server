const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    registro:{
        type: String,
        required: [true, 'Um log deve ter uma registro']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User' 
    },
    operacao:{
        type: String,
        required: [true, 'Um log deve ter uma operação'],
    },
    data:{
        type: Date,
        default: Date.now(),
        required: [true, 'Um log deve ter uma data'],
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Log = mongoose.model('logs', logSchema);

module.exports = Log;