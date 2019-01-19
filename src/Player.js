/* Represents a player in the game; either computer-controlled or human-controlled */
class Player 
{
	/**
	 *  Constructs a player with the passed paramters. Direction is
	 *  expected as an array with one entry per dimension, as either
	 *  1, 0, or -1 indicating the "forward" direction for this player.
	 *  
	 *  All others are lists of pieces belonging to this player; inPlay
	 *  are pieces on the board, owned are pieces not on the board, captured
	 *  are pieces captured from the enemy.
	 */
	constructor(identifier, direction, dropablePieces, capturedPieces, color = undefined)
	{
		this.identifier = identifier;
		this.direction = direction;
		this.dropablePieces = dropablePieces;
		this.capturedPieces = capturedPieces;
		this.color = color;
	}
}
