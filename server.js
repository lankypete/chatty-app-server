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
  console.log(message)
  wss.clients.forEach( (client) => {
    if (client.readyState === 1) {
      client.send(message)
    }
  })
}
broadcast('hello from the server')
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (msg) => {
    broadcast(msg)
  })
  
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => console.log('Client disconnected'));
});
