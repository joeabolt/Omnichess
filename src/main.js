function setMode(mode, errorMessage) {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("error").style.display = "none";
    document.getElementById("input").style.display = "none";
    document.getElementById("mainDisplay").style.display = "none";
    document.getElementById("boardCreator").style.display = "none";
    if (errorMessage) {
        document.getElementById("error").innerHTML = errorMessage;
        document.getElementById("error").style.display = "block";
    }
    if (mode === "lobby") {
        document.getElementById("lobby").style.display = "block";
    }
    if (mode === "mainDisplay") {
        document.getElementById("mainDisplay").style.display = "block";
    }
    if (mode === "input") {
        document.getElementById("input").style.display = "block";
    }
    if (mode === "boardCreator") {
        document.getElementById("boardCreator").style.display = "block";
    }
}

setMode("input");

// Spin-block; still allows external resources to load
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
sleep(100);
// TODO: Figure something else out, this is awful.
if (typeof io == "undefined") {
    location.reload();
}
const socket = io();

// socket.emit('event');
// socket.on('event', (data) => { func });

function adminFunc1() {
    socket.emit('admin function 1');
}
socket.on('admin response 1', data => {
    console.log(data);
});

socket.on('start game', (data) => {
    realizer = new Realizer(data.board);
    if (data.board.isEuclidean && data.board.array[0].length == data.board.array[1].length) {
        realizer = new RealizerAlgebraic(data.board);
    }
    realizer.realize();
    const isMyTurn = data.player === playerId;
    let turnMessage = `You are ${playerId}. Waiting for ${data.player} to play.`;
    if (isMyTurn) turnMessage = `It is your turn to play, ${playerId}!`;
    data.log.push(turnMessage);
    realizer.setLog(data.log);
    
    setMode("mainDisplay");
});
socket.on('join lobby', (event) => {
    document.getElementById("gameId").innerHTML = event.gameId;
    document.getElementById("gameIdHidden").innerHTML = event.gameId;
    document.getElementById("password").innerHTML = event.password;
    
    setMode("lobby");
});
socket.on('assign player', (event) => {
    playerId = event.player;
    document.getElementById("playerIdHidden").innerHTML = event.player;
})
socket.on('update', (data) => {
    console.log(data);
    realizer.board = data.board;
    realizer.realize();
    const isMyTurn = data.player === playerId;
    let turnMessage = `You are ${playerId}. Waiting for ${data.player} to play.`;
    if (isMyTurn) turnMessage = `It is your turn to play, ${playerId}!`;
    data.log.push(turnMessage);
    realizer.setLog(data.log);
});
socket.on('abandoned', () => {
    setMode("input", "The other player(s) left.");
});

let realizer = undefined;
let game = undefined;
let playerId = undefined;
const fileInput = document.getElementById("configInput");

fileInput.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
        loadConfig(JSON.parse(reader.result));
    };
    reader.readAsText(fileInput.files[0]);
};

function joinGame() {
    console.log("Joining game.");
    const gameId = document.getElementById("gameIdInput").value;
    const password = document.getElementById("passwordInput").value;
    socket.emit("join game", {gameId, password});
}

async function processClick(event, cellIndex) {
    if (realizer === undefined)
        return;

    event.stopPropagation();
    const move = realizer.processClick(cellIndex);
    if (move != null) {
        socket.emit('move', move);
    }
}

function clickHandler() {
    if (realizer === undefined)
        return;

    realizer.setActiveCell(undefined);
    realizer.realize();
}

function loadConfig(config) {
    game = Parser.Load(config);
    realizer = new Realizer(game.board);
    realizer.realize();
    game.startCPU(realizer);
    
    setMode("mainDisplay");
}

function loadPreloadedConfig2(path) {
    const actualPath = "preloaded" + path.substring(path.lastIndexOf('/'));
    const event = {configName: actualPath};
    socket.emit('start game', event);
}

function loadCustomConfig(configJson) {
    const event = {config: configJson};
    socket.emit('start game', event);
}

function save() {
    const dataString = JSON.stringify(Serializer.Serialize(game));
    console.log(dataString);

    var blob = new Blob([dataString], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download    = "SavedGame.json";
    a.href        = url;
    a.textContent = "Download SavedGame.json";
    a.click();
}
