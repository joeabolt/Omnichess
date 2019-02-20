/* Class to create game resources based on a json file */
class Parser 
{
	/**
	 *  Loads a json file in the specified filepath and
	 *  processes it to create a new game that can be run.
	 *  Assumes that the json file has a single object called
	 *  config_data.
	 */
	static Parse(filepath)
	{
		let script = document.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", filepath);
		document.body.insertBefore(script, document.scripts[0]);
		
		const promise = new Promise(function(resolve, reject) {
			setTimeout(() => {
				const game = Parser.Load();
				resolve(game);
			}, 250);

		});
		
		return promise;
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
			const newPlayer = new Player(template.identifier, template.direction, [], [], template.color);
			players.set(template.identifier, newPlayer);
		});
		
		/* Build end conditions */
		const endConditions = []; // no map, since it will not be accessed later
		config_data.endConditions.forEach((template) => {
			endConditions.push(new EndCondition(players.get(template.player), template.win, template.config));
		});
				
		/* Initialize the board */
		config_data.boardState.forEach((entry) => {
			const piece = new Piece()
				.setIdentifier(entry.piece)
				.setPlayer(players.get(entry.player))
				.setMoveVectors(Vector.Create(pieceTemplates.get(entry.piece).move))
				.setCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).capture))
				.setMoveCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).moveCapture));
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
