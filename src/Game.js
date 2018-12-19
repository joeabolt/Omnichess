/* Manages the state of the game */
class Game 
{
	constructor(board, players)
	{
		this.board = board;
		this.players = players;
		this.turnOrder = [
			new Turn(this.players[0], "* *"),
			new Turn(this.players[1], "* *")
		];
		this.turnIndex = 0;
		
		// Currently superfluous, early addition for weird turn patterns
		this.nextTurn = this.turnOrder[this.turnIndex];
		
		/**
		 *  Keeps track of who has won or lost.
		 *  Is positive for win, negative for loss,
		 *  magnitude equal to playerIndex + 1.
		 *  Will need updating in the future.
		 */
		this.gameState = 0;
	}
	
	PlayGame()
	{
		CheckGameEnd();
		while (turnIndex === 0)
		{
			DoTurn();
			CheckGameEnd();
		}
	}
	
	DoTurn()
	{
		let proposedMove = this.nextTurn.GetMove();
		while (!Validate(proposedMove)) proposedMove = this.nextTurn.GetMove();
		CommitMove(proposedMove);
	}
	
	CheckGameEnd()
	{
		
	}
	
	Validate(move)
	{
		
	}
	
	CommitMove(move)
	{
		
	}
}

/*
Ways to note win/loss conditions
count piece_ident = 0 @ start player_ident (also <, >, and end instead of start)
check piece_ident @ end player_ident
*/