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
			.setIdentifier(baseObj.identifier)
			.setPlayer(baseObj.player);
	}
	
	/**
	 *  Sets a piece to face the direction passed in as an array of 1s or -1s.
	 *  Changes the length of vector components, so it only really applies if
	 *  the piece has directional vectors.
	 */
	setDirection(direction)
	{
		this.moveVectors.concat(this.captureVectors).concat(this.moveCaptureVectors).forEach((vector) => {
			for (let i = 0; i < vector.components.length; i++)
			{
				vector.components[i].length *= direction[i];
			}
		});

		return this;
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
