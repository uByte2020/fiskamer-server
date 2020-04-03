const express               = require('express')
const serviceController     = require('./../controllers/serviceController')
const authController        = require('./../controllers/authController')
const solicitacaoRouter     = require('./solicitacaoRouter') 
const favoriteServiceRoutes = require('./favoriteServiceRoutes');
const commentRoutes         = require('./commentRoutes');

const router = express.Router();

router
    .route('/')
    .get(serviceController.getAllServices)

router
    .route('/:id')
    .get(serviceController.getService) 

router.use(authController.protect)

router.use('/:servicoId/solicitacaos', solicitacaoRouter) 
router.use('/:servicoId/favourites', favoriteServiceRoutes) 
router.use('/:servicoId/comments', commentRoutes) 

router.use(authController.restrictTo(0, 1))

router
    .route('/')    
    .post(serviceController.validateFilds, serviceController.verifyPayment, serviceController.createService)      
    
router
    .route('/:id')  
    .patch(
        serviceController.uploadServicePhoto,
        serviceController.resizeServicePhoto,
        serviceController.updateService)
    .delete(serviceController.deleteService)

module.exports = router;