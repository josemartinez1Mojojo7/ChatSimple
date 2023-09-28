import dotenv from 'dotenv'
import server from './app.js'

dotenv.config()
const port = process.env.APP_PORT
const host = process.env.APP_HOST

server.listen(port, () =>
  console.log(`Servidor levantado en http://${host}:${port}`)
)
