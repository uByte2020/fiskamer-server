const fornecedorStatistic = require('./../models/fornecedorStatisticModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const UserStatistic = require('./../models/userStatisticModel');
const User = require('./../models/userModel');

exports.getAllStatisticFornecedor = factory.getAll(fornecedorStatistic);
exports.getStatisticFornecedor = catchAsync(async (req, res, next) => {
  const doc = await fornecedorStatistic.find({ fornecedor: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.StatisticUser = async function() {
  await UserStatistic.deleteMany();
  const qtUserTotal = await User.find().count();
  const qtUserTotalActivo = await User.find({ active: 'true' }).count();
  const qtUserTotalInactivo = await User.find({ active: 'false' }).count();
  const qtUserTotalFornecedor = await User.find({
    'role.perfilCode': 1
  }).count();
  const qtUserActivoFornecedor = await User.find({
    'role.perfilCode': 1,
    active: 'true'
  }).count();
  const qtUserInactivoFornecedor = await User.find({
    'role.perfilCode': 1,
    active: 'false'
  }).count();
  const qtUserTotalCliente = await User.find({ 'role.perfilCode': 2 }).count();
  const qtUserActivoCliente = await User.find({
    'role.perfilCode': 2,
    active: 'true'
  }).count();
  const qtUserInactivoCliente = await await User.find({
    'role.perfilCode': 2,
    active: 'false'
  }).count();

  await UserStatistic.create({
    qtUserTotal: qtUserTotal,
    qtUserTotalActivo: qtUserTotalActivo,
    qtUserTotalInactivo: qtUserTotalInactivo,
    qtUserTotalFornecedor: qtUserTotalFornecedor,
    qtUserActivoFornecedor: qtUserActivoFornecedor,
    qtUserInactivoFornecedor: qtUserInactivoFornecedor,
    qtUserTotalCliente: qtUserTotalCliente,
    qtUserActivoCliente: qtUserActivoCliente,
    qtUserInactivoCliente: qtUserInactivoCliente
  });
};
