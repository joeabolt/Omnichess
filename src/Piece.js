/* Represents a piece in the game */
class Piece 
{
	constructor()
	{
		this.moveVectors = [];
		this.captureVectors = [];
		this.moveCaptureVectors = [];
		this.identifier = "";
		this.player = undefined;
	}
	
	static Create(baseObj)
	{
		/* Currently assumes baseObj has a string for
		 * move, capture, moveCapture, and player.
		 */
		return new Piece()
			.setMoveVectors(Vector.Create(baseObj.move))
			.setCaptureVectors(Vector.Create(baseObj.capture))
			.setMoveCaptureVectors(Vector.Create(baseObj.moveCapture))
			.setPlayer(baseObj.player);
	}
	
	setMoveVectors(moveVectors)
	{
		this.moveVectors = moveVectors;
		return this;
	}
	
	setCaptureVectors(captureVectors)
	{
		this.captureVectors = captureVectors;
		return this;
	}
	
	setMoveCaptureVectors(moveCaptureVectors)
	{
		this.moveCaptureVectors = moveCaptureVectors;
		return this;
	}
	
	setIdentifier(identifier)
	{
		this.identifier = identifier;
		return this;
	}
	
	setPlayer(player)
	{
		this.player = player;
		return this;
	}
}
