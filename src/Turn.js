/** 
 *  Represents a turn taken by a player
 *
 *  Uses a syntax to list what moves are legal:
 *  semicolon delimited list of "piece mcp" for
 *  move, capture, or promote. * can be used to
 *  say all pieces or all actions ("* *" means
 *  everything goes).
 */
class Turn
{
	constructor(player, board, legalActions)
	{
		this.player = player;
		this.board = board;
		this.legalActions = legalActions;
	}
	
	Validate(move)
	{
		let approved = true;
		if (this.legalActions.piece !== undefined)
		{
			// TODO: Dark magic to validate it's the right piece
		}
		if (this.board.contents[move.source].player !== this.player)
		{
			document.getElementById("message").innerHTML = "Invalid action: tried to move the opponent's piece.";
			approved = false;
			throw "Tried to move the enemy's piece.";
		}
		if (move.move && !this.legalActions.move)
		{
			document.getElementById("message").innerHTML = "Invalid action: must not move.";
			approved = false;
			throw "Tried to move when move disallowed.";
		}
		if (move.capture && !this.legalActions.capture)
		{
			document.getElementById("message").innerHTML = "Invalid action: must not capture.";
			approved = false;
			throw "Tried to capture when capture disallowed.";
		}
		if (!approved)
		{
			console.log("Did not approve!");
		}
		
		return approved;
	}
	
	/**
	 *  Ends the turn. Used so that Turns can
	 *  eventually include logic to customize what
	 *  turn follows them.
	 *
	 *  E.g., in checkers, moving a piece, this
	 *  would return undefined, but capturing would
	 *  return another Turn for this player that only
	 *  allows the capturing piece to capture again.
	 */
	EndTurn()
	{
		return undefined;
	}
}
