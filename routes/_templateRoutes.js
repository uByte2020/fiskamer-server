const express= require('express')
const _templateController    = require('./../controllers/_templateController')
const authController    = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect)

router
    .route('/')
    .get(_templateController.getAllCategories)      
    .post(_templateController.createCotegory)      
    
router
    .route('/:id')
    .patch(_templateController.update_template)
    .delete(_templateController.delete_template)

module.exports = router;