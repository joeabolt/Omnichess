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

        this.caution = 0.75;

        this.weightCaptures = 4;
        this.weightMoves = 1;

        this.weightControl = 4;
        this.weightInfluence = 1;
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
        const baseControlPercent = Metrics.getPercentBoardControlled(game.board, this);
        const baseInfluencePercent = Metrics.getPercentBoardInfluenced(game.board, this);
        possibleMoves.forEach((move) => {
            game.CommitMove(move);
            let controlDelta = (Metrics.getPercentBoardControlled(game.board, this) - baseControlPercent);
            let influenceDelta = (Metrics.getPercentBoardInfluenced(game.board, this) - baseInfluencePercent);
            let score = 100 * (controlDelta * this.weightControl + influenceDelta * this.weightInfluence);
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