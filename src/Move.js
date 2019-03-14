/* Represents a single action in the game */
class Move
{
	constructor(move = false, capture = false, srcLocation = 0, targetLocation = 0, capturedPiece = undefined)
	{
		this.move = move;
		this.capture = capture;
		this.srcLocation = srcLocation;
		this.targetLocation = targetLocation;
		this.capturedPiece = capturedPiece
	}
	
	setMove(move)
	{
		this.move = move;
		return this;
	}
	
	setCapture(capture)
	{
		this.capture = capture;
		return this;
	}
	
	setSourceLocation(srcLocation)
	{
		this.srcLocation = srcLocation;
		return this;
	}
	
	setDestinationLocation(targetLocation)
	{
		this.targetLocation = targetLocation;
		return this;
	}
	
	setCapturedPiece(capturedPiece)
	{
		this.capturedPiece = capturedPiece;
		return this;
	}
}