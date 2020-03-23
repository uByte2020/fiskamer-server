const express               =   require('express')
const profileController     =   require('./../controllers/profileController');
const authController        =   require('./../controllers/authController');

const router                =   express.Router();

router.use(authController.protect, authController.restrictTo(0))

router
    .route('/')
    .get(profileController.getAllProfiles)      
    .post(profileController.createProfile)      
    
router
    .route('/:id')
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile)

module.exports = router;