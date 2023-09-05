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
    let playerIdentifier = undefined;
    socket.on('admin function 1', () => {
        const keys = [];
        activeGames.forEach((value, key) => keys.push(key));
        socket.emit('admin response 1', keys);
    });
    socket.on('join game', (event) => {
        const gameId = event.gameId.trim();
        const password = event.password.trim();
        const game = activeGames.get(gameId);
        if (game && game.password === password) {
            // Join game and reserve slot
            playerIdentifier = game.getHumanAssignment();
            socket.join(gameId);
            const assignmentEvent = {"player": playerIdentifier};
            socket.emit('assign player', assignmentEvent);
            activeGame = gameId;
            // Activate lobby if waiting on more players or start game
            if (game.unclaimedHumanPlayers) {
                const joinLobbyEvent = {"gameId": gameId, "password": game.password};
                io.to(gameId).emit('join lobby', joinLobbyEvent);
            } else {
                game.startGame(io);
            }
        }
    });
    socket.on('start game', (event) => {
        const {config} = require(__dirname + '/src/config/' + event.configName);
        game = Parser.Load(config);

        // Update the server's log of who's in what games
        const gameId = getGameId();
        socket.join(gameId);
        activeGames.set(gameId, game);
        activeGame = gameId;

        // Cordinate between sever, game, and player
        game.gameId = gameId;
        game.password = getPassword();
        playerIdentifier = game.getHumanAssignment();
        const assignmentEvent = {"player": playerIdentifier};
        socket.emit('assign player', assignmentEvent);

        // Either send player to lobby if waiting for friends or start the game
        if (game.unclaimedHumanPlayers) {
            const joinLobbyEvent = {"gameId": gameId, "password": game.password};
            io.to(gameId).emit('join lobby', joinLobbyEvent);
        } else {
            game.startGame(io);
        }
    });
    socket.on('disconnect', () => {
        if (activeGame) {
            io.to(activeGame).emit('abandoned');
            activeGames.delete(activeGame);
            playerIdentifier = undefined;
            activeGame = undefined;
        }
    });
    socket.on('move', (event) => {
        console.log("Received a move event.");
        const move = new Move(event.move, event.capture, event.srcLocation, event.targetLocation, event.capturedPiece);
        const game = activeGames.get(activeGame);
        const owner = game.board.contents[event.srcLocation].player.identifier;
        if (owner === playerIdentifier) {
            game.step(move, true, () => {sendUpdate(activeGame);});
        } else {
            // TODO: Probably need to silently ignore, otherwise this could be spammed.
            game.log.push(`Illegal move - ${playerIdentifier} tried to move a piece they do not own.`);
            sendUpdate(activeGame);
        }
    });
});

function sendUpdate(gameId) {
    console.log("  Sending update.");
    const game = activeGames.get(gameId);
    const event = {board: game.board.asJson(), log: game.log, player: game.getNextPlayerIdentifier()};
    io.to(gameId).emit('update', event);
}

function getGameId() {
    let id = getLetter() + getLetter() + getLetter() + getLetter();
    while (activeGames.get(id)) {
        id = getLetter() + getLetter() + getLetter() + getLetter();
    }
    return id;
}

function getPassword() {
    return getNumber() + getNumber() + getNumber() + getNumber();
}

function getLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    return letters[Math.floor(Math.random() * letters.length)];
}

function getNumber() {
    const symbols = 'AFLQRSUWXY23456789'.split("");
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Initialize server
server.listen(8080, () => {
    console.log('listening on *:8080');
});