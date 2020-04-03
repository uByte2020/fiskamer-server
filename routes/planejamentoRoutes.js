const express= require('express')
const planejamentoController    = require('./../controllers/planejamentoController')
const authController    = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect)

router
    .route('/:id/addToPlanejamento')
    .patch(planejamentoController.addToPlanejamento)

    router
    .route('/:id/remFromPlanejamento')
    .patch(planejamentoController.removePlanejamento)

router
    .route('/')
    .get(planejamentoController.getAllPlanejamento)      
    .post(planejamentoController.validateData,
          planejamentoController.createPlanejamento)      
    
router
    .route('/:id')
    .get(planejamentoController.getPlanejamento)
    .patch(planejamentoController.updatePlanejamento)
    .delete(planejamentoController.deletePlanejamento)

module.exports = router;