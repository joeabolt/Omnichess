/* A class that can serve as a computer-controlled opponent */
class CPU
{
    constructor(identifier, direction, dropablePieces, capturedPieces, color = undefined, isCPU = true)
	{
		this.identifier = identifier;
		this.direction = direction;
		this.dropablePieces = dropablePieces;
		this.capturedPieces = capturedPieces;
		this.color = color;
		this.isCPU = isCPU;
    }
    
    GetNextMove(board)
    {
        const possibleMoves = Metrics.getAllCaptures(board, this).concat(Metrics.getAllMoves(board, this));
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
}