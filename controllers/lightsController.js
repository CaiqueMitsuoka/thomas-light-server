const lights = {}
const socket = require('../socket/server')
let timeout = new Date()

const lightsController = (server) => {
  return controller = {
    socket: socket.start(server, lights),
    show: (request, response) => {
      response.render('lights/show', {
        lights: Object.keys(lights)
      })
    },
    edit: (request, response, next) => {
      if((timeout - new Date()) < -2000) {
        lights[request.params.id].client.emit('status.update')
        console.log(`[LIGHTLIGHTERSERVER][POST][MAIN-LIGHT][TOGGLED]`)
        timeout = new Date()
      }

      response.redirect('/')
      next()
    },
    guitar: (request, response, next) => {
      response.render('lights/guitar', {})
    }
  }
}

module.exports = lightsController
