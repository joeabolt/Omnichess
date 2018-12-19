/* Manages the state of the game */
class Game 
{
	constructor(board, players, endConditions)
	{
		this.board = board;
		this.players = players;
		this.endConditions = endConditions;
		this.turnOrder = [
			new Turn(this.players[0], "* *"),
			new Turn(this.players[1], "* *")
		];
		this.turnIndex = 0;
		
		// For checking win/loss conditions at the right time
		this.nextTurn = this.turnOrder[this.turnIndex];
		this.lastTurn = undefined;
		
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
		/* Get a legal move */
		let proposedMove = this.nextTurn.GetMove();
		while (!Validate(proposedMove)) proposedMove = this.nextTurn.GetMove();
		
		/* Make the move */
		CommitMove(proposedMove);
		
		/* Get the next move */
		this.lastTurn = this.nextTurn;
		this.nextTurn = this.nextTurn.EndTurn();
		if (this.nextTurn === undefined)
		{
			this.turnIndex = (this.turnIndex + 1) % this.turnOrder.length;
			this.nextTurn = this.turnOrder[this.turnIndex];
		}
	}
	
	CheckGameEnd()
	{
		// TODO: Update to allow multiple simultaneous win/loss conditions
		this.endConditions.forEach((endCondition) => {
			const evaluation = endCondition.EvaluateGame(this.board, this.lastTurn, this.nextTurn);
			if (evaluation !== 0)
			{
				this.gameState = evaluation * (this.players.indexOf(endCondition.player) + 1);
			}
		});
	}
	
	Validate(move)
	{
		// This is definitely a permanent solution
		return true;
	}
	
	CommitMove(move)
	{
		
	}
}