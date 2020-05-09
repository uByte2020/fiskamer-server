const serviceStatistic = require('./../models/serviceStatisticModel');
const catchAsync = require('../utils/catchAsync');
const ServiceStatistic = require('./../models/serviceStatisticModel');
const ProviderStatistic = require('./../models/fornecedorStatisticModel');
const Servico = require('./../models/servicoModel');

exports.getStatisticService = catchAsync(async (req, res, next) => {
  const doc = await serviceStatistic
    .find()
    .populate({ path: 'ocorrenciaFornecedor._id', select: 'name' });
  res.status(200).json({
    status: 'success',
    data: {
      data: doc[doc.length - 1]
    }
  });
});

exports.createServiceStatistic = async function() {
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

exports.createFornecedorStatistic = async function(fornecedorId) {
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
