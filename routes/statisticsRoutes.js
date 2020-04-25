const express = require('express');
const authController = require('./../controllers/authController');
const userStatisticController = require('./../controllers/userStatisticController');
const serviceStatisticController = require('./../controllers/serviceStatisticController');
const solicitcaoStatisticController = require('./../controllers/solicitacaoStatisticController');
const favoriteStatisticController = require('./../controllers/favoriteStatisticsController');
const fornecedorStatisticController = require('./../controllers/fornecedorStatisticController');

const router = express.Router();
router.use(authController.protect, authController.restrictTo(0));
router.get('/user/', userStatisticController.getStatisticUsers);
router.get('/service/', serviceStatisticController.getStatisticService);
router.get(
  '/solicitacao/',
  solicitcaoStatisticController.getStatisticSolicitacao
);
router.get(
  '/favoritesService/',
  favoriteStatisticController.getStatisticFavorite
);
router.get(
  '/fornecedor/',
  fornecedorStatisticController.getAllStatisticFornecedor
);

router.use(authController.protect, authController.restrictTo(0, 1));
router
  .route('/fornecedor/:id')
  .get(fornecedorStatisticController.getStatisticFornecedor);

module.exports = router;
