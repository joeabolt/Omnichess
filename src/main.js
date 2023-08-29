const socket = io();
document.getElementById("lobby").style.display = "none";

// socket.emit('event');
// socket.on('event', (data) => { func });

socket.on('start game', (data) => {
    realizer = new Realizer(data.board);
    realizer.realize();
    realizer.setLog(data.log);
    
    document.getElementById("input").style.display = "none";
    document.getElementById("lobby").style.display = "none";
    document.getElementById("mainDisplay").style.display = "block";
});
socket.on('join lobby', (event) => {
    document.getElementById("gameId").innerHTML = event.gameId;
    document.getElementById("password").innerHTML = event.password;
    
    document.getElementById("input").style.display = "none";
    document.getElementById("lobby").style.display = "block";
    document.getElementById("mainDisplay").style.display = "none";
});
socket.on('update', (data) => {
    console.log(data);
    // TODO: Receive message from game as well
    realizer.board = data.board;
    realizer.realize();
    realizer.setLog(data.log);
});

let realizer = undefined;
let game = undefined;
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
    
    document.getElementById("input").style.display = "none";
    document.getElementById("mainDisplay").style.display = "block";
}

function loadPreloadedConfig(path) {
    const configScript = document.createElement("script");
    configScript.src = path;
    configScript.onload = () => {
        loadConfig(config);
    };
    document.body.appendChild(configScript);
}

function loadPreloadedConfig2(path) {
    const actualPath = "preloaded" + path.substring(path.lastIndexOf('/'));
    console.log("Actual path: " + actualPath);
    const event = {configName: actualPath};
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
