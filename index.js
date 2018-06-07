const express = require('express')
const socket = require('socket.io')
const port = 4000
let users = []
let conversation = []

// App setup
const app = express()
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`)
})

// Static files
app.use(express.static('public'))

// Socket setup
const io = socket(server)

// Listen out for event called connection, when a browser makes a connection, on connection fire callback function
io.on('connection', (socket) => {
  console.log('Connection made', socket.id)

  // On user connect, send convo
  socket.emit('convo', conversation)

  // Sends chat data out to all connected sockets
  socket.on('chat', (data) => {
    console.log(data)
    // Store convo on server
    conversation.push(data)
    io.sockets.emit('chat', data)
    socket.handle = data.handle
    checkArr(data.handle)
  })

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  })

  socket.on('disconnect', () => {
    users.splice(users.indexOf(socket.handle), 1)
  })
})

// Show online users every 3 seconds
setInterval(() => {
  io.sockets.emit('users', users)
}, 3000)

// Check the user isnt already in the user array
function checkArr(handle) {
  if (!users.includes(handle)) {
    users.push(handle)    
  }
}