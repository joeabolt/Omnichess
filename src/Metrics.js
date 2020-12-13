/* Calculates metrics based on board state */
class Metrics {
    static countPossibleActions(board, player) {
        return Metrics.getAllCaptures(board, player).length + Metrics.getAllMoves(board, player).length;
    }

    static getAllAlliedPieces(board, player) {
        const alliedPieces = [];
        board.contents.forEach((piece) => {
            if (piece && piece.player === player) {
                alliedPieces.push(piece);
            }
        });
        return alliedPieces;
    }

    static getAllCaptures(board, player) {
        const alliedPieces = Metrics.getAllAlliedPieces(board, player);
        const captures = [];
        alliedPieces.forEach((piece) => {
            const pieceLocation = board.contents.indexOf(piece);
            [...new Set(piece.moveCaptureVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, pieceLocation, true, true));
            }, []))].forEach((captureDest) => {
                if (board.contents[captureDest] && board.contents[captureDest].player !== player) {
                    captures.push(new Move(true, true, pieceLocation, captureDest, board.contents[captureDest]));
                }
            });
        });
        return captures;
    }

    static getAllMoves(board, player) {
        const alliedPieces = Metrics.getAllAlliedPieces(board, player);
        const moves = [];
        alliedPieces.forEach((piece) => {
            const pieceLocation = board.contents.indexOf(piece);
            [...new Set(piece.moveVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, pieceLocation));
            }, []))].forEach((destination) => {
                if (board.contents[destination] === undefined) {
                    moves.push(new Move(true, false, pieceLocation, destination));
                }
            });
        });
        return moves;
    }

    static getPercentBoardControlled(board, player) {
        const alliedPieces = Metrics.getAllAlliedPieces(board, player);
        const captureLocations = [];
        alliedPieces.forEach((piece) => {
            const pieceLocation = board.contents.indexOf(piece);
            [...new Set(piece.moveCaptureVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, pieceLocation, true, false));
            }, []))].forEach((captureDest) => {
                if (captureLocations.indexOf(captureDest) === -1) {
                    if (board.contents[captureDest] === undefined ||
                        (board.contents[captureDest] && board.contents[captureDest].player !== player))
                    captureLocations.push(captureDest);
                }
            });
        });
        return captureLocations.length / (board.contents.length - 1);
    }

    static getPercentBoardInfluenced(board, player) {
        const alliedPieces = Metrics.getAllAlliedPieces(board, player);
        const moveLocations = [];
        alliedPieces.forEach((piece) => {
            const pieceLocation = board.contents.indexOf(piece);
            [...new Set(piece.moveVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, pieceLocation, false, false));
            }, []))].forEach((destination) => {
                if (moveLocations.indexOf(destination) === -1) {
                    moveLocations.push(destination);
                }
            });
        });
        return moveLocations.length / (board.contents.length - 1);
    }

    static isChecked(board, pieceLocation) {
        const checkedPiece = board.contents[pieceLocation];
        let checked = false;
        board.contents.forEach((piece) => {
            if (!piece || piece.player === checkedPiece.player) {
                return;
            }
            const canAttack = [...new Set(piece.moveCaptureVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, game.board.contents.indexOf(piece), true, false));
            }, []))].includes(pieceLocation);
            checked = checked || canAttack;
        });

        return checked;
    }

    static getScoreOfCheckedPieces(board, player) {
        return board.contents.reduce((sum, piece, index) => {
            if (piece && piece.player === player && Metrics.isChecked(board, index)) {
                sum = sum + piece.value;
            }
            return sum;
        }, 0);
    }
}
