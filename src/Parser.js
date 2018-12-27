/* Class to create game resources based on a json file */
class Parser 
{
	/**
	 *  Loads a json file in the specified filepath and
	 *  processes it to create a new game that can be run.
	 *  Assumes that the json file has a single object called
	 *  config_data.
	 */
	static async Parse(filepath)
	{
		let script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", filepath);
		document.body.insertBefore(script, document.scripts[0]);
		
		/* Inspired by / copied from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep */
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		
		let game = undefined;
		async function load() {
			await sleep(100);
			game = Parser.Load();
		}
		
		await load();
		/* End inspiration */
		
		return game;
	}
	
	static Load()
	{
		/* Load piece identifiers mapped to their templates */
		const pieceTemplates = new Map();
		config_data.pieces.forEach((template) => {
			pieceTemplates.set(template.identifier, template);
		});
				
		/* Build the board */
		const boardTemplate = config_data.board;
		let board = undefined;
		if (boardTemplate.adjacencyMatrix !== undefined)
		{
			board = new Board(boardTemplate.adjacencyMatrix);
		}
		else
		{
			board = new Board(Board.Generate2D(boardTemplate.lengths[0], boardTemplate.lengths[1]));
		}
				
		/* Build the players */
		const players = new Map();
		config_data.players.forEach((template) => {
			// TODO: Magically parse the lists of dropable and captured pieces
			const newPlayer = new Player(template.identifier, template.direction, template.dropablePieces, template.capturedPieces);
			players.set(template.identifier, newPlayer);
		});
		
		/* Build end conditions */
		const endConditions = []; // no map, since it will not be accessed later
		config_data.endConditions.forEach((template) => {
			endConditions.push(new EndCondition(players.get(template.player), template.win, template.config));
		});
				
		/* Initialize the board */
		config_data.boardState.forEach((entry) => {
			const piece = new Piece();
			piece.setIdentifier(entry.piece);
			piece.setPlayer(players.get(entry.player));
			piece.setMoveVectors(Vector.Create(pieceTemplates.get(entry.piece).move));
			piece.setCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).capture));
			piece.setMoveCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).moveCapture));
			piece.setDirection(piece.player.direction);
			board.contents[entry.location] = piece;
		});
				
		/* Build the game */
		const playerList = [];
		players.forEach((value, key) => playerList.push(value));
		const game = new Game(board, playerList, endConditions);

		return game;
	}
}
