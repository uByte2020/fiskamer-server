const express= require('express')
const stateController    = require('./../controllers/statesController')
const authController    = require('./../controllers/authController')

const router = express.Router();

router
    .route('/')
    .get(authController.protect,stateController.getAllStates)      
    .post(authController.protect,stateController.createState)      
    
router
    .route('/:id')
    .patch(authController.protect,stateController.updateState)
    .delete(authController.protect,stateController.deleteState)

module.exports = router;
