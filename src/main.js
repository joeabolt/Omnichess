let promise = Parser.Parse("./src/config/test01.js");
let realizer = undefined;

promise.then(function(parsedGame) {
	realizer = new Realizer(parsedGame);
	realizer.Realize();
});

function setActiveCell(event, cellIndex)
{
	event.stopPropagation();
	console.log("The active cell is now " + cellIndex + ".");
	realizer.SetActiveCell(cellIndex);
	realizer.Realize();
}

function clickHandler()
{
	console.log("There is no longer an active cell.");
	realizer.SetActiveCell(-1);
	realizer.Realize();
}