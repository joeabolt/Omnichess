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

function processClick(event, cellIndex)
{
    if (realizer === undefined)
        return;

    event.stopPropagation();
    realizer.ProcessClick(cellIndex);
    realizer.Realize();
}

function clickHandler()
{
    if (realizer === undefined)
        return;

    realizer.SetActiveCell(undefined);
    realizer.Realize();
}

function loadConfig(config)
{
    game = Parser.Load(config);
    realizer = new Realizer(game);
    realizer.Realize();
    game.StartCPU(realizer);
    
    document.getElementById("input").style.display = "none";
    document.getElementById("mainDisplay").style.display = "block";
}

function loadPreloadedConfig(path)
{
    const configScript = document.createElement("script");
    configScript.src = path;
    configScript.onload = () => {
        loadConfig(config);
    };
    document.body.appendChild(configScript);
}
