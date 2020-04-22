const express          = require('express')
const logController    = require('./../controllers/logController')
const authController   = require('./../controllers/authController')
const router = express.Router();

router.use(authController.protect, authController.restrictTo(1))
router
    .route('/') 
    .get(logController.getLog)     //Pegar todos os logs 

router.use(authController.protect, authController.restrictTo(0,1))
router 
    .route('/:id')
    .delete(logController.deleteLog)
    .get(logController.getAllLog) //Pegar todos os logs de um determinado user
    
  
module.exports = router;