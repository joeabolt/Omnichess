const socket = io();

// socket.emit('event');
// socket.on('event', (data) => { func });

socket.on('start game', (data) => {
    console.log(data);
    realizer = new Realizer(data.board);
    realizer.realize();
    
    document.getElementById("input").style.display = "none";
    document.getElementById("mainDisplay").style.display = "block";
});
socket.on('update', (data) => {
    realizer.board = data.board;
    realizer.realize();
});

let realizer = undefined;
let game = undefined;
const fileInput = document.getElementById("configInput")

fileInput.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
        loadConfig(JSON.parse(reader.result));
    };
    reader.readAsText(fileInput.files[0]);
};

async function processClick(event, cellIndex) {
    if (realizer === undefined)
        return;

    event.stopPropagation();
    const move = realizer.processClick(cellIndex);
    if (move != null) {
        await game.step(move, true, () => {realizer.realize();});
    }
    realizer.realize();
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
