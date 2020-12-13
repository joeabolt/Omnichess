/* A class that can serve as a computer-controlled opponent */
class CPU extends Player {
    constructor(identifier, direction, dropablePieces, capturedPieces, color = undefined, isCPU = true) {
        super(identifier, direction, dropablePieces, capturedPieces, color, isCPU);

        this.aggression = 0.5;
        this.caution = 0.75;

        this.weightCaptures = 0.8;
        this.weightMoves = 0.2;

        this.weightControl = 0.8;
        this.weightInfluence = 0.2;
    }

    GetNextMove(board, game) {
        const possibleActions = Metrics.getAllCaptures(board, this).concat(Metrics.getAllMoves(board, this));
        const bestAction = this.GetBestOption(possibleActions, game);
        return bestAction;
    }

    GetBestOption(possibleMoves, game) {
        const enemy = game.players[1 - game.players.indexOf(this)];
        let bestMove = undefined;
        let bestMoveScore = 0;
        const baseControlPercent = Metrics.getPercentBoardControlled(game.board, this);
        const baseInfluencePercent = Metrics.getPercentBoardInfluenced(game.board, this);
        const currentThreat = Metrics.getScoreOfCheckedPieces(game.board, this);
        const currentAttack = Metrics.getScoreOfCheckedPieces(game.board, enemy);
        possibleMoves.forEach((move) => {
            game.CommitMove(move, false);

            /* Base score based on maximizing future options */
            const controlDelta = Math.pow(Metrics.getPercentBoardControlled(game.board, this) - baseControlPercent + 1, 5);
            const influenceDelta = Math.pow(Metrics.getPercentBoardInfluenced(game.board, this) - baseInfluencePercent + 1, 5);
            const baseScore = 100 * (controlDelta * this.weightControl + influenceDelta * this.weightInfluence);
            let score = baseScore;
            if (move.move && !move.capture) {
                score += baseScore * this.weightMoves;
            }
            if (move.capture) {
                score += baseScore * this.weightCaptures + (move.capturedPiece.value / (1 - this.aggression));
            }

            /* Adjustments for moving in or out of check */
            const newThreat = Metrics.getScoreOfCheckedPieces(game.board, this);
            const newAttack = Metrics.getScoreOfCheckedPieces(game.board, enemy);
            const destChecked = Metrics.isChecked(game.board, move.targetLocation);
            game.Undo(move, false);
            let checkAdjustment = 0;
            checkAdjustment += (currentThreat - newThreat) / Math.pow(1 - this.caution, 2);
            checkAdjustment += (newAttack - currentAttack) / Math.pow(1 - this.aggression, 2);
            score += checkAdjustment;

            if (score > bestMoveScore) {
                console.log("New best move: " + move.toString());
                console.log("  Base score: " + baseScore);
                console.log("  Move weight: " + (baseScore * this.weightMoves));
                console.log("  Capture weight: " + (move.capture ? baseScore * this.weightCaptures + move.capturedPiece.value : 0));
                console.log("  Check weight: " + (checkAdjustment) + ` (T${currentThreat} -> ${newThreat}; A${currentAttack} -> ${newAttack})`);
                console.log("  New best score: " + (bestMoveScore));
                bestMoveScore = score;
                bestMove = move;
            }
        });
        return bestMove;
    }

    SetCaptureWeight(newCaptureWeight) {
        newCaptureWeight = Math.max(0, Math.min(1, newCaptureWeight));
        this.weightCaptures = newCaptureWeight;
        this.weightMoves = 1 - this.weightCaptures;
        return this;
    }

    SetCaution(newCaution) {
        newCaution = Math.max(0, Math.min(1, newCaution));
        this.caution = newCaution;
        return this;
    }

    SetControlWeight(newControlWeight) {
        newControlWeight = Math.max(0, Math.min(1, newControlWeight));
        this.weightControl = newControlWeight;
        this.weightInfluence = 1 - this.weightControl;
        return this;
    }

    SetInfluenceWeight(newInfluenceWeight) {
        newInfluenceWeight = Math.max(0, Math.min(1, newInfluenceWeight));
        this.weightInfluence = newInfluenceWeight;
        this.weightControl = 1 - this.weightInfluence;
        return this;
    }

    SetMoveWeight(newMoveWeight) {
        newMoveWeight = Math.max(0, Math.min(1, newMoveWeight));
        this.weightMoves = newMoveWeight;
        this.weightCaptures = 1 - this.weightMoves;
        return this;
    }
}
