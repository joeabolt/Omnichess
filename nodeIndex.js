const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);

const {Parser} = require("./src/Parser.js");
const {Move} = require("./src/Move.js");

// At the url, respond with the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// If they request a resource, return it
app.use(express.static(__dirname, {}));

const activeGames = new Map();

// More magic
io.on('connection', (socket) => {
    let activeGame = undefined;
    console.log('user connected');
    // socket.broadcast.emit('hi'); // Goes to everyone except that socket
    // io.emit('event name', payload); // Goes to everyone
    socket.on('join game', (event) => {
        // Expect event.id, event.password
        // Start game with both players
        // socket.join(gameId)
    });
    socket.on('start game', (event) => {
        // Expect event.configId, event.configJson
        // TODO: Return landing page with id and password
        const {config} = require(__dirname + '/src/config/' + event.configName);
        game = Parser.Load(config);
        game.startCPU();

        // Update the server's log of who's in what games
        const gameId = getGameId();
        socket.join(gameId);
        activeGames.set(gameId, game);
        activeGame = gameId;

        // Update the display
        // TODO: Move this logic to Game.js
        const startGameEvent = {board: game.board, log: game.log};
        io.to(gameId).emit('start game', startGameEvent);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // TODO
    });
    socket.on('move', (event) => {
        const move = new Move(event.move, event.capture, event.srcLocation, event.targetLocation, event.capturedPiece);
        activeGames.get(activeGame).step(move, true, () => {sendUpdate(activeGame);})
    });
});

function sendUpdate(gameId) {
    const game = activeGames.get(gameId);
    const event = {board: game.board, log: game.log};
    io.to(gameId).emit('update', event);
}

function getGameId() {
    let id = getLetter() + getLetter() + getLetter() + getLetter();
    while (activeGames.get(id)) {
        id = getLetter() + getLetter() + getLetter() + getLetter();
    }
    return id;
}

function getLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    return letters[Math.floor(Math.random() * letters.length)];
}

// Initialize server
server.listen(8080, () => {
    console.log('listening on *:8080');
});