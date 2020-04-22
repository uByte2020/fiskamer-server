const Planejamento  = require('../models/planejamentoModel')
const Solicitacao   = require('../models/solicitacaoModel')
const catchAsync    = require('../utils/catchAsync');
const factory       = require('./handlerFactory');
const AppError      = require('./../utils/appError');

exports.addToPlanejamento=catchAsync(async(req,res, next) => { 
    
    if(!req.body.solicitacao) return next(new AppError('No solicitacoes to add', 400));
    
    const doc = await Planejamento.findByIdAndUpdate(req.params.id, {$push:{solicitacoes:req.body.solicitacao}}, {
        new:            true, //Para devolver o documento actualizado
        runValidators:  true,
        upsert: true 
    });
    res.status(200).json({
        status: 'success',
        data: { 
            data: doc
        }
    })
})

exports.removePlanejamento=catchAsync(async(req,res, next)=>{ 

    if(!req.body.solicitacao) return next(new AppError('No solicitacoes to add', 400));

    const doc = await Planejamento.findByIdAndUpdate(req.params.id, { $pull: { solicitacoes: req.body.solicitacao} }, {
        new:            true, //Para devolver o documento actualizado
        runValidators:  true
    });
    res.status(200).json({
        status: 'success',
        data: { 
            data: doc
        }
    })
})

exports.validateData = catchAsync(async (req, res, next) => {
    
    if(!req.body.cliente) req.body.cliente = req.user.id;
    req.body.data = new Date(req.body.data)
    req.body.estado = 3;

    const solicitacaoTemp = {
                            data: req.body.data, 
                            estado: req.body.estado, 
                            cliente: req.body.cliente
                        }
    req.body.solicitacoes = [];
    
    await Promise.all(
        req.body.servicos.map(async (servico) =>{
            solicitacaoTemp.servico = servico;
            const solicitacaoId = await Solicitacao.create(solicitacaoTemp);
            req.body.solicitacoes.push(solicitacaoId._id);
        })
    );

    next();
});

exports.getAllPlanejamento       = factory.getAll(Planejamento);
exports.getPlanejamento          = factory.getOne(Planejamento);
exports.createPlanejamento       = factory.createOne(Planejamento);
exports.updatePlanejamento       = factory.updateOne(Planejamento);
exports.deletePlanejamento       = factory.deleteOne(Planejamento);