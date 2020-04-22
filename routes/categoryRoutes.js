const express= require('express')
const categoryController    = require('./../controllers/categoryController')
const authController    = require('./../controllers/authController')

const router = express.Router();

router.use(authController.protect, authController.restrictTo(0, 1))

router
    .route('/')
    .get(categoryController.getAllCategories)      
    .post(categoryController.createCotegory)      
    
router
    .route('/:id')
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router;