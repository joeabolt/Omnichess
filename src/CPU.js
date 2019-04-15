/* A class that can serve as a computer-controlled opponent */
class CPU extends Player
{
    constructor(identifier, direction, dropablePieces, capturedPieces, color = undefined, isCPU = true)
    {
        super(identifier, direction, dropablePieces, capturedPieces, color, isCPU);

        this.caution = 0.75;

        this.weightCaptures = 0.8;
        this.weightMoves = 0.2;

        this.weightControl = 0.8;
        this.weightInfluence = 0.2;
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

            let controlDelta = Metrics.getPercentBoardControlled(game.board, this) - baseControlPercent + 1;
            let influenceDelta = Metrics.getPercentBoardInfluenced(game.board, this) - baseInfluencePercent + 1;
            let score = 100 * (controlDelta * this.weightControl + influenceDelta * this.weightInfluence);
            if (move.move && !move.capture)
            {
                score += score * this.weightMoves;
            }
            if (move.capture)
            {
                score += score * this.weightCaptures;
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