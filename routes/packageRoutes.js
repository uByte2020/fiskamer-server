const express = require('express');
const packageController = require('./../controllers/packageController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(packageController.getAllPackage)
  .post(
    authController.protect,
    authController.restrictTo(0),
    packageController.createPackage
  );

router
  .route('/:id')
  .get(packageController.getPackage)
  .patch(
    authController.protect,
    authController.restrictTo(0),
    packageController.updatePackage
  )
  .delete(
    authController.protect,
    authController.restrictTo(0),
    packageController.deletePackage
  );

module.exports = router;
