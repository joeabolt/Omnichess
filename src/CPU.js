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

            const controlDelta = Metrics.getPercentBoardControlled(game.board, this) - baseControlPercent + 1;
            const influenceDelta = Metrics.getPercentBoardInfluenced(game.board, this) - baseInfluencePercent + 1;
            const baseScore = 100 * (controlDelta * this.weightControl + influenceDelta * this.weightInfluence);
            let score = baseScore;
            if (move.move && !move.capture)
            {
                score += baseScore * this.weightMoves;
            }
            if (move.capture)
            {
                score += baseScore * this.weightCaptures;
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

    SetCaptureWeight(newCaptureWeight)
    {
        newCaptureWeight = Math.max(0, Math.min(1, newCaptureWeight));
        this.weightCaptures = newCaptureWeight;
        this.weightMoves = 1 - this.weightCaptures;
        return this;
    }

    SetCaution(newCaution)
    {
        newCaution = Math.max(0, Math.min(1, newCaution));
        this.caution = newCaution;
        return this;
    }

    SetControlWeight(newControlWeight)
    {
        newControlWeight = Math.max(0, Math.min(1, newControlWeight));
        this.weightControl = newControlWeight;
        this.weightInfluence = 1 - this.weightControl;
        return this;
    }

    SetInfluenceWeight(newInfluenceWeight)
    {
        newInfluenceWeight = Math.max(0, Math.min(1, newInfluenceWeight));
        this.weightInfluence = newInfluenceWeight;
        this.weightControl = 1 - this.weightInfluence;
        return this;
    }

    SetMoveWeight(newMoveWeight)
    {
        newMoveWeight = Math.max(0, Math.min(1, newMoveWeight));
        this.weightMoves = newMoveWeight;
        this.weightCaptures = 1 - this.weightMoves;
        return this;
    }
}