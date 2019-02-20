let promise = Parser.Parse("./src/config/test01.js");
let realizer = undefined;

promise.then(function(parsedGame) {
	// game = parsedGame;
	realizer = new Realizer(parsedGame);
	setInterval(() => {realizer.Realize();}, 150);
});