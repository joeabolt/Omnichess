let realizer = undefined;
let game = undefined;
const fileInput = document.getElementById("configInput")

fileInput.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
        game = Parser.Load(JSON.parse(reader.result));
        realizer = new Realizer(game);
        realizer.Realize();
    };
    reader.readAsText(fileInput.files[0]);

    document.getElementById("inputSpan").style.display = "none";
    document.getElementById("mainDisplay").style.display = "block";
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
