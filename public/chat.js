// Make connection
const socket = io.connect('http://localhost:4000')

// Query DOM
const form = document.querySelector('form')
const message = document.querySelector('#message')
const handle = document.querySelector('#handle')
const output = document.querySelector('#output')
const feedback = document.querySelector('#feedback')
const users = document.querySelector('#users')

let userArr = []

// Get current conversation
socket.on('convo', (data) => {
  for (let entry of data) {
    output.innerHTML += '<p><strong>' + entry.handle + ':</strong>' + entry.message + '</p>'
  }
})

// Emit events
form.onsubmit = (e) => {
  e.preventDefault()
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  })
  message.value = ''
}

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value)
})

// Listen for events
socket.on('chat', (data) => {
  feedback.innerHTML = ''
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>'
})

socket.on('typing', (data) => {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em><p>'
})

socket.on('users', (data) => {
  userArr = data
  console.log(data)
  users.innerHTML = ""
  for (let user of data) {
    users.innerHTML += `<p>${user}</p>`
  }
})