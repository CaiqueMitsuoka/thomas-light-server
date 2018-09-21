const io = require('socket.io')
const crypto = require('crypto')

const SocketServer = {
  start: (server, lights) => {
    SocketServer.lights = lights
    SocketServer.server = io(server)
    SocketServer.setupClient()

    return SocketServer.server
  },
  setupClient: () => {
    SocketServer.server.on('connection',  (client) => {
      console.log('[THOMAS-LIGHT-SERVER][WS][CONNECTION]')

      client.on('register', SocketServer.handleRegister(client))
        .on('disconnect', SocketServer.handleDisconnect(client))
        .on('panel.connection', SocketServer.handlePanelConnect(client))
        .on('guitar.press', SocketServer.handleGuitarPress(client))
    })
  },
  handleRegister: (client) => {
    return (data) => {
      client.lightId = crypto.createHash('md5').update(data).digest("hex")
      console.log(`[THOMAS-LIGHT-SERVER][WS][REGISTER] Data: ${data}, Id: ${client.lightId}`)

      SocketServer.lights[client.lightId] = { client: client }

      client.emit('registered', client.lightId)
    }
  },
  handleDisconnect: (client) => {
    return () => {
      console.log('[THOMAS-LIGHT-SERVER][WS][DISCONNECT]')
      delete SocketServer.lights[client.lightId]
    }
  },
  handlePanelConnect: (client) => {
    return () => {
      client.join('panels')
      console.log('[THOMAS-LIGHT-SERVER][WS][PANEL][JOIN]')
    }
  },
  handleGuitarPress: (client) => {
    return (button) => {
      console.log('[THOMAS-LIGHT-SERVER][WS][GUITAR-PRESS]' + button)
      SocketServer.server.to('panels').emit(`guitar.${button}`)
    }
  }
}

module.exports = SocketServer
