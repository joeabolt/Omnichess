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
        
        this.caution = 0.667;

        this.weightCaptures = 0.8;
        this.weightMoves = 0.2;

        this.weightControl = 0.7;
        this.weightInfluence = 0.3;
    }

    GetNextMove(board, game)
    {
        const possibleActions = Metrics.getAllCaptures(board, this).concat(Metrics.getAllMoves(board, this));
        const bestAction = this.GetBestOption(possibleActions, game);
        return bestAction;
    }

    GetBestOption(possibleMoves, game)
    {
        let bestMove = undefined;
        let bestMoveScore = 0;
        possibleMoves.forEach((move) => {
            game.CommitMove(move);
            let score = 100 * (Metrics.getPercentBoardControlled(game.board, this) * this.weightControl + 
                Metrics.getPercentBoardInfluenced(game.board, this) * this.weightInfluence);
            if (move.move && !move.capture)
            {
                score *= this.weightMoves;
            }
            if (move.capture)
            {
                score *= this.weightCaptures;
            }
            if (Metrics.isChecked(game.board, move.targetLocation))
            {
                score *= (1 - this.caution);
            }
            if (score > bestMoveScore)
            {
                bestMoveScore = score;
                bestMove = move;
            }
            game.Undo();
        });
        return bestMove;
    }
}