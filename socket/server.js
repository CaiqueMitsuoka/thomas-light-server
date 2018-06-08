const io = require('socket.io')
const crypto = require('crypto')

const SockerServer = {
  start: (server, lights) => {
    SockerServer.lights = lights
    SockerServer.server = io(server)
    SockerServer.setupClient()

    return SockerServer.server
  },
  setupClient: () => {
    SockerServer.server.on('connection',  (client) => {
      console.log('[THOMAS-LIGHT-SERVER][WS][CONNECTION]')

      client.on('register', SockerServer.handleRegister(client))
        .on('disconnect', SockerServer.handleDisconnect(client))
    })
  },
  handleRegister: (client) => {
    return (data) => {
      client.lightId = crypto.createHash('md5').update(data).digest("hex")
      console.log(`[THOMAS-LIGHT-SERVER][WS][REGISTER] Data: ${data}, Id: ${client.lightId}`)

      SockerServer.lights[client.lightId] = { client: client }

      client.emit('registered', client.lightId)
    }
  },
  handleDisconnect: (client) => {
    return () => {
      console.log('[THOMAS-LIGHT-SERVER][WS][DISCONNECT]')
      delete SockerServer.lights[client.lightId]
    }
  }
}

module.exports = SockerServer
