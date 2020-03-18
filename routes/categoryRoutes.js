const express= require('express')
const categoryController    = require('./../controllers/categoryController')
const authController    = require('./../controllers/authController')

const router = express.Router();

router
    .route('/')
    .get(authController.protect,categoryController.getAllCategories)      
    .post(authController.protect,categoryController.createCotegory)      
    
router
    .route('/:id')
    .patch(authController.protect,categoryController.updateCategory)
    .delete(authController.protect,categoryController.deleteCategory)

module.exports = router;