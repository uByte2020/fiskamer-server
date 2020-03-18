const express               =   require('express')
const profileController     =   require('./../controllers/profileController');
const authController        =   require('./../controllers/authController');

const router                =   express.Router();

router
    .route('/')
    .get(authController.protect,profileController.getAllProfiles)      
    .post(authController.protect,profileController.createProfile)      
    
router
    .route('/:id')
    .patch(authController.protect,profileController.updateProfile)
    .delete(authController.protect,profileController.deleteProfile)

module.exports = router;