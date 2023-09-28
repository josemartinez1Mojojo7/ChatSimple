import express from 'express'
import http from 'http'
import { Server as SocketIO } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new SocketIO(server, { cors: { origin: '*' } })

app.get('/', (req, res) => { res.json({ message: 'ChatSimple' }) })

let conectados = []
io.on('connection', (socket) => {
  console.log('Cliente conectado')

  conectados.push(socket.id)
  io.emit('listaConectados', conectados)
  socket.on('disconnect', () => {
    conectados = conectados.filter((client) => client !== socket.id)
    io.emit('listaConectados', conectados)
  })

  socket.on('mensaje', (data) => {
    console.log(data)
    socket.broadcast.emit('mensaje', {
      data,
      from: socket.id
    })
  })
})

export default server
