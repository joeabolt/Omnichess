let promise = Parser.Parse("./src/config/test01.js");
let realizer = undefined;

promise.then(function(parsedGame) {
	realizer = new Realizer(parsedGame);
	realizer.Realize();
});

function setActiveCell(event, cellIndex)
{
	event.stopPropagation();
	realizer.SetActiveCell(cellIndex);
	realizer.Realize();
}

function clickHandler()
{
	realizer.SetActiveCell(-1);
	realizer.Realize();
}