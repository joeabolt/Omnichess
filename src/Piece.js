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