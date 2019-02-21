let realizer = undefined;
const fileInput = document.getElementById("configInput")

fileInput.onchange = () => {
	const reader = new FileReader();
	reader.onload = () => {
		const game = Parser.Load(JSON.parse(reader.result));
		realizer = new Realizer(game);
		realizer.Realize();
	};
	reader.readAsText(fileInput.files[0]);
	
	document.getElementById("inputSpan").style.display = "none";
	document.getElementById("mainDisplay").style.display = "block";
};

function processClick(event, cellIndex)
{
	event.stopPropagation();
	realizer.ProcessClick(cellIndex);
	realizer.Realize();
}

function clickHandler()
{
	if (realizer === undefined)
		return;

	realizer.SetActiveCell(-1);
	realizer.Realize();
}