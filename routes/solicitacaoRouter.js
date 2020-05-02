const express = require('express');
const solicitacaoController = require('./../controllers/solicitacaoController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get(
  '/:fornecedoId/clientes',
  solicitacaoController.getClientesByFornecedor
);

router.use(authController.protect);

router
  .route('/')
  .post(
    solicitacaoController.validateData,
    solicitacaoController.createSolicitacao
  );

router
  .route('/MySolicitacoes')
  .get(
    solicitacaoController.getMySolicitations,
    solicitacaoController.getAllSolicitacao
  );

router.use(authController.restrictTo(0, 1));

router
  .route('/')
  .get(
    solicitacaoController.getUserSolicitations,
    solicitacaoController.getAllSolicitacao
  )
  .post(solicitacaoController.createSolicitacao);

router
  .route('/:id')
  .get(solicitacaoController.getSolicitacao)
  .patch(solicitacaoController.updateSolicitacao)
  .delete(solicitacaoController.deleteSolicitacao);

module.exports = router;
