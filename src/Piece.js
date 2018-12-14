/* Represents a piece in the game */
class Piece 
{
	constructor()
	{
		this.moveVectors = [];
		this.captureVectors = [];
		this.moveCaptureVectors = [];
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
	
	setMoveVectors(newValue)
	{
		this.moveVectors = newValue;
		return this;
	}
	
	setCaptureVectors(newValue)
	{
		this.captureVectors = newValue;
		return this;
	}
	
	setMoveCaptureVectors(newValue)
	{
		this.moveCaptureVectors = newValue;
		return this;
	}
	
	setPlayer(newValue)
	{
		this.player = newValue;
		return this;
	}
}
