const express = require('express');
const subCategoryController = require('./../controllers/subCategoryController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(subCategoryController.getAllSubCategorias)
  .post(
    authController.protect,
    authController.restrictTo(0),
    subCategoryController.createSubCategoria
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo(0),
    subCategoryController.updateSubCategoria
  )
  .get(subCategoryController.getSubCategoria)
  .delete(
    authController.protect,
    authController.restrictTo(0),
    subCategoryController.deleteSubCategoria
  );

module.exports = router;
