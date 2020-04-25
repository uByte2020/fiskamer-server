const mongoose = require('mongoose');

const userStatisticSchema = new mongoose.Schema({
  qtUserTotal: {
    type: Number,
    required: ['É requerida a quantidade de utilizadores registados no sistema']
  },
  qtUserTotalActivo: {
    type: Number,
    required: ['É requerida a quantidade de utilizadores activos no sistema']
  },
  qtUserTotalInactivo: {
    type: Number,
    required: ['É requerida a quantidade de utilizadores inactivos no sistema']
  },
  qtUserTotalFornecedor: {
    type: Number,
    required: ['É requerida a quantidade total de fornecedores']
  },
  qtUserActivoFornecedor: {
    type: Number,
    required: ['É requerida a quantidade total de fornecedores activos']
  },
  qtUserInactivoFornecedor: {
    type: Number,
    required: ['É requerida a quantidade total de fornecedores inactivos']
  },
  qtUserTotalCliente: {
    type: Number,
    required: ['É requerida a quantidade total de clientes']
  },
  qtUserActivoCliente: {
    type: Number,
    required: ['É requerida a quantidade total de clientes activos']
  },
  qtUserInactivoCliente: {
    type: Number,
    required: ['É requerida a quantidade total de clientes inactivos']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const UserStatistic = mongoose.model('userstatistics', userStatisticSchema);
module.exports = UserStatistic;
