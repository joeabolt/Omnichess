const {Player} = require("./Player.js");

/* A class that can serve as a computer-controlled opponent */
class CPU extends Player {
    constructor(identifier, direction, dropablePieces, capturedPieces, color = undefined, isCPU = true) {
        super(identifier, direction, dropablePieces, capturedPieces, color, isCPU);

        this.aggression = 0.5; // Higher values place increased importance on capturing enemy
        this.caution = 0.75; // Higher values place increased importance on protecting ally

        this.weightCaptures = 0.6; // Multiplies the "value" of captures
        this.weightMoves = 0.2; // Multiplies the "value" of moves

        this.weightControl = 0.8; // Increases importance of being able to capture most of the board
        this.weightInfluence = 0.2; // Increases importance of being able to move to most of the board

        this.verbose = true;
        this.lastMove = null;
        this.doubleLastMove = null;
    }

    GetNextMove(board, game) {
        const possibleActions = Metrics.getAllCaptures(board, this).concat(Metrics.getAllMoves(board, this));
        const bestAction = this.GetBestOption(possibleActions, game);
        return bestAction;
    }

    GetBestOption(possibleMoves, game) {
        if (this.verbose) console.log("CONSIDERING MOVES");
        const enemy = game.players[1 - game.players.indexOf(this)];
        let bestMove = undefined;
        let bestMoveScore = 0;
        const baseControlPercent = Metrics.getPercentBoardControlled(game.board, this);
        const baseInfluencePercent = Metrics.getPercentBoardInfluenced(game.board, this);
        const currentThreat = Metrics.getScoreOfCheckedPieces(game.board, this);
        const currentAttack = Metrics.getScoreOfCheckedPieces(game.board, enemy);
        const currentDefense = Metrics.getScoreOfDefendedPieces(game.board, this);
        possibleMoves.forEach((move) => {
            game.commitMove(move, false);

            /* Base score based on maximizing future options */
            const controlDelta = Math.pow(Metrics.getPercentBoardControlled(game.board, this) - baseControlPercent + 1, 3.5);
            const influenceDelta = Math.pow(Metrics.getPercentBoardInfluenced(game.board, this) - baseInfluencePercent + 1, 3.5);
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
            const newDefense = Metrics.getScoreOfDefendedPieces(game.board, this);
            const destChecked = Metrics.isChecked(game.board, move.targetLocation);
            game.undo(move, false);
            const srcProtected = Metrics.isProtected(game.board, move.srcLocation);
            const srcChecked = Metrics.isChecked(game.board, move.srcLocation);
            const pieceValue = game.board.contents[move.srcLocation].value;
            let checkAdjustment = 0;
            checkAdjustment += (currentThreat - newThreat) / Math.pow(1 - this.caution, 2);
            let attackDelta = newAttack - currentAttack;
            if (move.capture) {
                // Don't penalize for captures
                attackDelta += move.capturedPiece.value;
            }
            checkAdjustment += ((attackDelta) / Math.pow(1 - this.aggression, 2));
            checkAdjustment /= 2.5;
            score += checkAdjustment;

            let pieceLossAdjustment = destChecked ? -1 * pieceValue / (1 - this.caution) : 0;
            if (destChecked && (!srcChecked || (srcChecked && srcProtected))) {
                // Moving into check to get a check on another piece? We'll lose this one for sure. Wipe out benefits
                pieceLossAdjustment += -1 * ((newAttack - currentAttack) / Math.pow(1 - this.aggression, 3));
            }
            score += pieceLossAdjustment;

            let defenseAdjustment = (newDefense - currentDefense) / (1 - this.caution) / 1.25;
            score += defenseAdjustment;

            if (move.equals(this.doubleLastMove)) {
                // TODO: Improve cycle tracking
                // score = 1; // So it doesn't get trapped in a cycle
            }

            if (score > bestMoveScore) {
                if (this.verbose) {
                    console.log("New best move: " + move.toString());
                    console.log("  Base score: " + baseScore);
                    console.log("  Move/Capture weight: " + (baseScore * this.weightMoves) + " : " + (move.capture ? baseScore * this.weightCaptures + move.capturedPiece.value : 0));
                    console.log("  Check weight: " + (checkAdjustment) + ` (T${currentThreat} -> ${newThreat}; A${currentAttack} -> ${newAttack})`);
                    console.log("  Loss weight: " + (pieceLossAdjustment) + ` (SC:${srcChecked} DC:${destChecked} SP:${srcProtected})`);
                    console.log("  Defense weight: " + defenseAdjustment + ` (D${currentDefense} -> ${newDefense})`);
                    console.log("  New best score: " + (score));
                }

                bestMoveScore = score;
                bestMove = move;
            }
        });

        this.doubleLastMove = this.lastMove;
        this.lastMove = bestMove;

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


if (typeof window === 'undefined') {
    module.exports.CPU = CPU;
}