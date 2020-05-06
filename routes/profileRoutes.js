const express = require('express');
const profileController = require('./../controllers/profileController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(profileController.getAllProfiles)
  .post(
    authController.protect,
    authController.restrictTo(0),
    profileController.createProfile
  );

router
  .route('/:id')
  .get(profileController.getProfile)
  .patch(
    authController.protect,
    authController.restrictTo(0),
    profileController.updateProfile
  )
  .delete(
    authController.protect,
    authController.restrictTo(0),
    profileController.deleteProfile
  );

module.exports = router;
