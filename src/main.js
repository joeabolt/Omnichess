let game = undefined;
let realizer = undefined;

async function startGame()
{
	game = await Parser.Parse("./src/config/testDualBoard.json");
	
	realizer = new Realizer(game);
	
	setInterval(() => {realizer.Realize();}, 500);
}

startGame();
