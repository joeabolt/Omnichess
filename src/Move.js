/* Represents a single action in the game */
class Move
{
	constructor(move = false, capture = false, srcPiece = undefined, srcLocation = 0, destLocation = 0, capturedPiece = undefined)
	{
		this.move = move;
		this.capture = capture;
		this.srcPiece = srcPiece;
		this.srcLocation = srcLocation;
		this.destLocation = destLocation;
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
	
	setSourcePiece(srcPiece)
	{
		this.srcPiece = srcPiece;
		return this;
	}
	
	setSourceLocation(srcLocation)
	{
		this.srcLocation = srcLocation;
		return this;
	}
	
	setDestinationLocation(destLocation)
	{
		this.destLocation = destLocation;
		return this;
	}
	
	setCapturedPiece(capturedPiece)
	{
		this.capturedPiece = capturedPiece;
		return this;
	}
}