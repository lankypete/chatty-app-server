// server.js

const express = require('express');
const socket = require('ws').Server;
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
    if (client.readyState === 1) {
      client.send(message)
    }
  })
}
function userCount() {
  const count = wss.clients.size
  const usrCount = { count, type: 'usr-count' }
  wss.clients.forEach( (client) => {
    client.send(JSON.stringify(usrCount))
  })
}
broadcast('hello from the server')

wss.on('connection', (socket) => {
  console.log('Client connected');
  userCount()
  

  socket.on('message', (msg) => {
    broadcast(msg)
  })
  
  socket.on('close', () => {
    console.log('Client disconnected')
    userCount() 
  })
});
