// server.js

const express = require('express');
const ws_lib = require('ws');
const socket = ws_lib.Server;
const http = require('http')

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on %d`, PORT));

// Create the WebSockets server
const wss = new socket({ server });

function broadcast(message) {
  wss.clients.forEach( (client) => {
    if (client.readyState === ws_lib.OPEN) {
      client.send(message, (err) => {
        if (err) {
          console.log('Error broadcasting message to client', err)
        }
      })
    }
  })
}
function userCount() {
  const count = wss.clients.size
  const usrCount = { count, type: 'usr-count' }
  wss.clients.forEach( (client) => {
    client.send(JSON.stringify(usrCount), (err) => {
      if (err) {
        console.log('error sending user count', err)
      }
    })
  })
}
broadcast('hello from the server')

wss.on('connection', (socket) => {
  console.log('Client connected');
  const userColors = ['color1','color2', 'color3', 'color4']
  socket.color = userColors[Math.floor(Math.random()*4)]
  userCount()

  socket.on('message', (msg) => {
    msg = JSON.parse(msg)
    msg.color = socket.color
    msg = JSON.stringify(msg)
    broadcast(msg)
  })

  socket.on('close', () => {
    console.log('Client disconnected')
    userCount()
  })
});
