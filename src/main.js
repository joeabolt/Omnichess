/* Initial script */

async function startGame()
{
	const game = await Parser.Parse("./src/config/test01.js");
	
	const realizer = new Realizer(game);
	
	setInterval(() => {realizer.Realize();}, 500);	
}

startGame();
