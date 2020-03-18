const express           = require('express')
const userController    = require('./../controllers/userController')
const authController    = require('./../controllers/authController')

const router = express.Router();

router.post('/signup', authController.siginup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword:token', authController.resetPassword);

router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo(1))

router
    .route('/')
    .get(userController.getAllUsers)        // API to get All Users
    .post(userController.createUser);       // Criar API para api que cria uma nova User
 
router
    .route('/:id')
    .get(userController.getUser)            // API to get User sending a id by parameter (id)
    .patch(userController.updateUser)       // API to update User sending a id by parameter (id)
    .delete(userController.deleteUser);     // API to delete User sending a id by parameter (id)

module.exports = router;