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
	constructor(player, legalActions)
	{
		this.player = player;
		this.legalActions = legalActions;
	}
	
	GetMove()
	{
		let move = undefined;
		let approved = false;
		while (!approved)
		{
			move = this.player.GetMove();
			approved = true;
			if (this.legalActions.piece !== undefined)
			{
				// TODO: Dark magic to validate it's the right piece
			}
			approved = approved && ~(this.legalActions.move ^ move.move);
			approved = approved && ~(this.legalActions.capture ^ move.capture);
			if (!approved) console.log("Did not approve!");
		}
		return move;
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
