const {Turn} = require("./Turn.js");

/* Manages the state of the game */
class Game  {
    constructor(board, players, endConditions) {
        this.board = board;
        this.players = players;
        this.endConditions = endConditions;

        /* Default turn order is alternating, any legal move goes */
        const legalActions = {};
        legalActions.piece = undefined; /* undefined is flag for any */
        legalActions.move = true;
        legalActions.capture = true;
        this.turnOrder = [
            new Turn(this.players[0], this.board, legalActions),
            new Turn(this.players[1], this.board, legalActions)
        ];
        this.turnIndex = 0;

        this.moveStack = []; /* also the undo stack */
        this.redoStack = [];

        // For checking win/loss conditions at the right time
        this.nextTurn = this.turnOrder[this.turnIndex];
        this.lastTurn = undefined;

        /**
         *  Keeps track of who has won or lost.
         *  Is positive for win, negative for loss,
         *  magnitude equal to playerIndex + 1.
         *  Will need updating in the future.
         */
        this.gameState = 0;

        this.log = [];
    }

    /**
     * Convenience function to kickstart a game when a CPU must go first.
     * Deliberately has no side effects so it can safely be called even 
     * if a human player ought to move first.
     */
    startCPU() {
        if (this.nextTurn.player.isCPU) {
            this.step(this.nextTurn.player.GetNextMove(this.board, this), true);
        }
    }

    async step(move, doCPUTurn = true, callback = () => {}) {
        if (this.gameState === 0) {
            this.doTurn(move);
        }
        this.checkGameEnd();
        if (this.gameState !== 0) {
            this.log.push("The game is now over!");
        }
        callback();
        while (doCPUTurn && this.gameState === 0 && this.nextTurn.player.isCPU) {
            await this.step(this.nextTurn.player.GetNextMove(this.board, this), false, callback);
        }
    }

    doTurn(move) {
        if (!this.nextTurn.Validate(move)) {
            return false;
        }
        if (!this.validate(move)) {
            console.warn("Game invalidated the move.");
            this.log.push("Illegal move.");
            return false;
        }

        this.lastTurn = this.nextTurn;
        this.commitMove(move, true);

        return true;
    }

    checkGameEnd() {
        // TODO: Update to allow multiple simultaneous win/loss conditions
        this.endConditions.forEach((endCondition) => {
            const evaluation = endCondition.EvaluateGame(this.board, this.lastTurn, this.nextTurn);
            if (evaluation !== 0) {
                this.gameState = evaluation * (this.players.indexOf(endCondition.player) + 1);
            }
        });
        if (this.gameState !== 0) {
            const name = this.players[Math.abs(this.gameState)-1].identifier;
            this.log.push(`${name} ${this.gameState > 0 ? "won!" : "lost..."}`);
        }
    }

    /**
     *  Validates that a move is legal.
     *
     *  TODO: Add support for promote, drop
     */
    validate(move) {
        const actor = this.board.contents[move.srcLocation];

        let vectorList = [];
        let includeCaptureEligible = false;

        if (move.move && !move.capture) {
            vectorList = actor.moveVectors;
        }
        else if (move.capture && !move.move) {
            vectorList = actor.captureVectors;
            includeCaptureEligible = true;
        }
        else if (move.move && move.capture) {
            vectorList = actor.moveCaptureVectors;
            includeCaptureEligible = true;
        }

        const allValidDestinations = vectorList.flatMap(vector => this.board.GetCellIndices(vector, move.srcLocation, includeCaptureEligible));
        return allValidDestinations.includes(move.targetLocation);
    }

    /**
     *  Commits a move to the board, and pushes it to the move stack
     */
    commitMove(move, showOutput = true) {
        let capturedPiece = null;
        if (move.capture) {
            capturedPiece = this.board.contents[move.targetLocation];
            this.nextTurn.player.capturedPieces.push(this.board.contents[move.targetLocation]);
            this.board.contents[move.targetLocation] = undefined;
        }
        if (move.move) {
            this.board.contents[move.targetLocation] = this.board.contents[move.srcLocation];
            this.board.contents[move.srcLocation] = undefined;
            this.board.contents[move.targetLocation].setMoves(1);
        } else {
            this.board.contents[move.srcLocation].setMoves(1);
        }
        this.moveStack.push(move);
        if (showOutput) {
            let message = [];
            if (move.move) {
                const movingPlayer = this.nextTurn.player.identifier;
                const movingPiece = this.board.contents[move.targetLocation].identifier;
                message.push(`${movingPlayer} moved ${movingPiece} from ${move.srcLocation} to ${move.targetLocation}.`);
            }
            if (move.capture) {
                const capturedPieceName = capturedPiece.identifier;
                const capturingPieceName = this.board.contents[move.move ? move.targetLocation : move.srcLocation].identifier;
                const capturedPlayer = capturedPiece.player.identifier;
                message.push(`${capturedPlayer}'s ${capturedPieceName} at ${move.targetLocation} was captured by ${capturingPieceName}.`);
            }
            this.log.push(message.join(" "));
        }

        this.turnIndex = (this.turnIndex + 1) % this.turnOrder.length;
        this.nextTurn = this.turnOrder[this.turnIndex];
        this.updateUndoRedoVisibility();
        // TODO: Add support for promote, drop
    }

    undo(showOutput = true) {
        const moveToUndo = this.moveStack.pop();
        if (moveToUndo.move) {
            this.board.contents[moveToUndo.srcLocation] = this.board.contents[moveToUndo.targetLocation];
            this.board.contents[moveToUndo.targetLocation] = undefined;
        }
        if (moveToUndo.capture) {
            this.board.contents[moveToUndo.targetLocation] = moveToUndo.capturedPiece;
        }
        this.redoStack.push(moveToUndo);
        this.updateUndoRedoVisibility();

        this.board.contents[moveToUndo.srcLocation].setMoves(-1);

        this.turnIndex = (this.turnIndex - 1 + this.turnOrder.length) % this.turnOrder.length;
        this.nextTurn = this.turnOrder[this.turnIndex];
    }

    redo(showOutput = true) {
        this.commitMove(this.redoStack.pop(), showOutput);
    }

    updateUndoRedoVisibility() {
        // TODO: Move this logic to the front-end
        return;
        // if (game.moveStack.length > 0) {
        //     document.getElementById("undo").style.display = "inline";
        // }
        // else {
        //     document.getElementById("undo").style.display = "none";
        // }

        // if (game.redoStack.length > 0) {
        //     document.getElementById("redo").style.display = "inline";
        // }
        // else {
        //     document.getElementById("redo").style.display = "none";
        // }
    }
}

if (typeof window === 'undefined') {
    module.exports.Game = Game;
}