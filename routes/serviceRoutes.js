const express = require('express');
const serviceController = require('./../controllers/serviceController');
const authController = require('./../controllers/authController');
const solicitacaoRouter = require('./solicitacaoRouter');
const favoriteServiceRoutes = require('./favoriteServiceRoutes');
const commentRoutes = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    serviceController.getSerciveByFornecedor,
    serviceController.getAllServices
  );

router.route('/:id').get(serviceController.getService);

router
  .route('/within/:distance/center/:coordenates')
  .get(serviceController.getServicesWithin);

router
  .route('/distances/:coordenates')
  .get(serviceController.getServicesDistances);

router
  .route('/byCategoria/:categoria')
  .get(serviceController.getServicesbyCategoria);

router.use(authController.protect);

router.use('/:servicoId/solicitacaos', solicitacaoRouter);
router.use('/:servicoId/favourites', favoriteServiceRoutes);
router.use('/:servicoId/comments', commentRoutes);

router
  .route('/:id/like')
  .patch(serviceController.like, serviceController.updateService);

router.use(authController.restrictTo(0, 1));

router
  .route('/:id/disponibilidades')
  .patch(serviceController.addDisponibilidade)
  .delete(serviceController.removeDisponibilidade);

router
  .route('/')
  .post(
    serviceController.validateFilds,
    serviceController.verifyPayment,
    serviceController.createService
  );

router
  .route('/:id')
  .patch(
    serviceController.uploadServicePhoto,
    serviceController.resizeServicePhoto,
    serviceController.updateService
  )
  .delete(serviceController.deleteService);

module.exports = router;
