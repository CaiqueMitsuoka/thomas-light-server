const lightsRouter = require('express').Router()

module.exports = (server) => {
  const lightsController = require('../controllers/lightsController')(server)

  lightsRouter.post('/:id', lightsController.edit)
  lightsRouter.get('/', lightsController.show)
  lightsRouter.get('/guitar', lightsController.guitar)

  return lightsRouter
}
