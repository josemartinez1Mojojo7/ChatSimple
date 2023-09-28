import { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import './App.css'

const backUrl = import.meta.env.VITE_APP_BACK_URI;
const socket = io(backUrl)

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [clients, setClients] = useState([])
  const [client, setClient] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const newMessage = {
      data: message,
      from: 'Me'
    }
    socket.emit('mensaje', message)
    setMessages([...messages, newMessage])
    setMessage('')
  }

  useEffect(() => {
    socket.on('mensaje', message => {
      setMessages([...messages, message])
    })
  },[messages])

  useEffect(() => {
    socket.on('listaConectados', clients => {
      setClients(clients)
    })
    socket.on('connect', function() {
      setClient(socket.id)
    })  
  },[])

  return (
    <>
      <section>
        <article className='clientes'>
          <ul className='caja-clientes'>  
            {
              clients.map((c,index)=>(
                <li key={index}>
                  <p className='cliente'>
                    <span className='from'>{c}</span>
                    <span>{c==client? 'Me':'Anonimo'}</span>
                  </p>
                </li>
              ))
            }
          </ul>
        </article>
        <article className='mensajes'>
          <ul className='caja-mensajes'>
            {messages.length === 0 ?
              <li className='dialogo-center'>Sin mensajes</li>
            :
              messages.map((m, index) => (
                <li key={index} className={`${m.from === 'Me'? 'dialogo-right': 'dialogo-left'}`}>
                  <p className='mensaje'>
                    <span className='from'>{m.from}</span>
                    <span>{m.data}</span>
                  </p>
                </li>
              ))
            }
          </ul>
          <form onSubmit={handleSubmit}>
            <input 
              type='text' placeholder='Escribe tu meansage'
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />
            <button type='submit'>Enviar</button>
          </form>
        </article>
      </section>
    </>
  )
}

export default App
