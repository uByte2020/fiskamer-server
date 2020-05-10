const express = require('express');
const categoryController = require('./../controllers/categoryController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/:id/subCategorias')
  .patch(
    authController.protect,
    authController.restrictTo(0, 1),
    categoryController.addSubCategoria
  )
  .delete(
    authController.protect,
    authController.restrictTo(0, 1),
    categoryController.removeSubCategoria
  );

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo(0, 1),
    categoryController.createCotegory
  );

router
  .route('/:id')
  .get(categoryController.getCategorie)
  .patch(
    authController.protect,
    authController.restrictTo(0, 1),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo(0, 1),
    categoryController.deleteCategory
  );

module.exports = router;
