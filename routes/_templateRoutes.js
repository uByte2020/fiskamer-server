const express= require('express')
const _templateController    = require('./../controllers/_templateController')
const authController    = require('../controllers/authController')

const router = express.Router();

router
    .route('/')
    .get(authController.protect,_templateController.getAllCategories)      
    .post(authController.protect,_templateController.createCotegory)      
    
router
    .route('/:id')
    .patch(authController.protect,_templateController.update_template)
    .delete(authController.protect,_templateController.delete_template)

module.exports = router;