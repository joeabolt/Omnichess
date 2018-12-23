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
		const move = player.GetMove();
		// TODO: validate that move is described in legalActions.piece and legalActions.action
		// If so, return it; otherwise dispaly error and prompt for another
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
