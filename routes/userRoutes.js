const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const solicitacaoRouter = require('./solicitacaoRouter');
const favoriteServiceRoutes = require('./favoriteServiceRoutes');
const serviceRouter = require('./serviceRoutes');

const router = express.Router();

router.post('/signup', authController.siginup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router.use(
  '/:clientId/solicitacaos',
  authController.restrictTo(0),
  solicitacaoRouter
);
router.use(
  '/:userId/favourites',
  authController.restrictTo(0),
  favoriteServiceRoutes
);
router.use('/:fornecedorId/services', serviceRouter);

router
  .route('/')
  .get(userController.getAllUsers) // API to get All Users
  .post(userController.createUser); // Criar API para api que cria uma nova User

router
  .route('/:id')
  .get(userController.getUser) // API to get User sending a id by parameter (id)
  .patch(userController.updateUser) // API to update User sending a id by parameter (id)
  .delete(userController.deleteUser); // API to delete User sending a id by parameter (id)

module.exports = router;
