const express= require('express')
const packageController    = require('./../controllers/packageController')
const authController    = require('./../controllers/authController')

const router = express.Router();

router
    .route('/')
    .get(authController.protect,packageController.getAllPackage)      
    .post(authController.protect,packageController.createPackage)      
    
router
    .route('/:id')
    .patch(authController.protect,packageController.updatePackage)
    .delete(authController.protect,packageController.deletePackage)

module.exports = router;