/* Manages the state of the game */
class Game 
{
	constructor(board, players, endConditions)
	{
		this.board = board;
		this.players = players;
		this.endConditions = endConditions;
		
		/* Default turn order is alternating */
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
		// TODO: Output winner / loser
	}
	
	DoTurn()
	{
		/* Get a legal move */
		let proposedMove = this.nextTurn.GetMove();
		while (!this.Validate(proposedMove)) proposedMove = this.nextTurn.GetMove();
		
		/* Make the move */
		this.CommitMove(proposedMove);
		
		/* Get the next move */
		this.lastTurn = this.nextTurn;
		this.nextTurn = this.nextTurn.EndTurn();
		if (this.nextTurn === undefined)
		{
			this.turnIndex = (this.turnIndex + 1) % this.turnOrder.length;
			this.nextTurn = this.turnOrder[this.turnIndex];
		}
	}
	
	/* Special version for testing */
	DoTurn_Test(move)
	{
		if (!this.Validate(move))
		{
			throw "Invalid move passed to DoTurn_Test";
			return;
		}
		
		/* Make the move */
		this.CommitMove(move);
		
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
	
	/**
	 *  Validates that a move is legal.
	 *
	 *  TODO: Add support for promote, drop
	 */
	Validate(move)
	{
		let validity = false;
		const parts = move.split(" ");
		const startLocation = Number(parts[0]);
		const actor = this.board.contents[startLocation];
		const action = parts[1];
		const target = Number(parts[2]);
		
		let vectorList = [];
		let includeCaptureEligible = false;
		
		if (action === "->")
		{
			vectorList = actor.moveVectors;
		}
		else if (action === "x")
		{
			vectorList = actor.captureVectors;
			includeCaptureEligible = true;
		}
		else if (action === "x->")
		{
			vectorList = actor.moveCaptureVectors;
			includeCaptureEligible = true;
		}
		
		vectorList.forEach((vector) => {
				validity = validity || this.board.GetCellIndices(vector, startLocation, includeCaptureEligible).has(target);
			});
		
		return validity;
	}
	
	/**
	 *  Commits a move to the board.
	 *  Valid move syntaxes:
	 *    pos_ident -> pos_ident (movement)
	 *    pos_ident x pos_ident (capture)
	 *    pos_ident x-> pos_ident (move-capture)
	 *  Valid, but unsupported:
	 *    pos_ident drop piece_ident (drop)
	 *    pos_ident promote (promote)
	 */
	CommitMove(move)
	{
		const words = move.split(" ");
		if (move.includes("x"))
		{
			this.nextTurn.player.capturedPieces.push(this.board.contents[Number(words[2])]);
			this.board.contents[Number(words[2])] = undefined;
		}
		if (move.includes("->"))
		{
			this.board.contents[Number(words[2])] = this.board.contents[Number(words[0])];
			this.board.contents[Number(words[0])] = undefined;
			return;
		}
		// TODO: Add support for promote, drop
	}
}
