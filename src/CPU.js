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
        
        this.weightCaptures = 0.7;
        this.weightMoves = 0.3;

        this.weightControl = 0.3;
        this.weightInfluence = 0.7;
    }

    GetNextMove(board, game)
    {
        const possibleCaptures = Metrics.getAllCaptures(board, this);
        const possibleMoves = Metrics.getAllMoves(board, this);
        if (possibleCaptures.length > 0 && Math.random() < this.weightCaptures)
        {
            /* find best capture action */
            const bestAction = this.GetBestOption(possibleCaptures, game);
            return bestAction;
        }
        else
        {
            /* find best move action */
            const bestAction = this.GetBestOption(possibleMoves, game);
            return bestAction;
        }
    }

    GetBestOption(possibleMoves, game)
    {
        let bestMove = undefined;
        let bestMoveScore = 0;
        possibleMoves.forEach((move) => {
            game.CommitMove(move);
            const score = Metrics.getPercentBoardControlled(game.board, this) * this.weightControl + 
                Metrics.getPercentBoardInfluenced(game.board, this) * this.weightInfluence;
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