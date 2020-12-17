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

    static getAllAlliedPieceLocationsByType(board, player, pieceType) {
        const alliedPieces = [];
        board.contents.forEach((piece, location) => {
            if (piece && piece.player === player && piece.identifier === pieceType) {
                alliedPieces.push(location);
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
            [...new Set(piece.captureVectors.reduce((returnSet, vector) => {
                return returnSet.concat(board.GetCellIndices(vector, pieceLocation, true, true));
            }, []))].forEach((captureDest) => {
                if (board.contents[captureDest] && board.contents[captureDest].player !== player) {
                    captures.push(new Move(false, true, pieceLocation, captureDest, board.contents[captureDest]));
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

    /**
     * Returns a Map denoting checks on the target pieceLocation.
     * Map is organized as (checkersLocation) => [vectorsYieldingCheck]
     */
    static checkedBy(board, pieceLocation, player = null, enforceCaptureEligible = false) {
        if (player == null) {
            player = board.contents[pieceLocation].player;
        }
        const checkedBy = new Map();
        board.contents.forEach((piece, enemyLocation) => {
            if (!piece || piece.player === player) {
                return;
            }
            piece.captureVectors.concat(piece.moveCaptureVectors).forEach(vector => {
                const destinations = board.GetCellIndices(vector, enemyLocation, true, enforceCaptureEligible);
                if (destinations.indexOf(pieceLocation) != -1) {
                    if (checkedBy.has(enemyLocation)) {
                        checkedBy.set(enemyLocation, checkedBy.get(enemyLocation).push(vector));
                    } else {
                        checkedBy.set(enemyLocation, [vector]);
                    }
                }
            });
        });
        return checkedBy;
    }

    static isProtected(board, pieceLocation, enforceCaptureEligible = false) {
        const alliedPlayer = board.contents[pieceLocation].player;
        return board.contents.some((piece, location) => {
            if (!piece || piece.player !== alliedPlayer) {
                return false;
            }
            return piece.captureVectors.concat(piece.moveCaptureVectors).some(vector => {
                const destinations = board.GetCellIndices(vector, location, true, enforceCaptureEligible);
                return destinations.indexOf(pieceLocation) != -1;
            });
        });
    }

    static isChecked(board, pieceLocation) {
        if (board.contents[pieceLocation] == null) {
            return false;
        }
        return Metrics.checkedBy(board, pieceLocation).size > 0;
    }

    static isCheckedFor(board, location, player) {
        return Metrics.checkedBy(board, location, player, false).size > 0;
    }

    // Returns true if the player can put a piece at location; false otherwise
    static isInfluenced(board, location, player) {
        return board.contents.some((piece, enemyLocation) => {
            if (!piece || piece.player === player) {
                return false;
            }
            let movePoints = new Set();
            piece.moveVectors.forEach(vector => [...board.GetCellIndices(vector, enemyLocation)].forEach(dest => movePoints.add(dest)));
            piece.moveCaptureVectors.forEach(vector => [...board.GetCellIndices(vector, enemyLocation)].forEach(dest => movePoints.add(dest)));

            return movePoints.has(location);
        });
    }

    static getScoreOfCheckedPieces(board, player) {
        return board.contents.reduce((sum, piece, index) => {
            if (piece && piece.player === player && Metrics.isChecked(board, index)) {
                sum = sum + piece.value;
            }
            return sum;
        }, 0);
    }

    static getScoreOfDefendedPieces(board, player) {
        return board.contents.reduce((sum, piece, index) => {
            if (piece && piece.player === player && Metrics.isProtected(board, index)) {
                sum = sum + piece.value;
            }
            return sum;
        }, 0);
    }

    static isCheckmated(board, pieceLocation) {
        const checkmatedPiece = board.contents[pieceLocation];
        const checkmatedPlayer = checkmatedPiece.player;
        // 1. That piece must be in check
        if (!Metrics.isChecked(board, pieceLocation)) {
            return false;
        }
        // 2. Everywhere that piece can move / moveCapture must be in check
        let destinations = new Set();
        checkmatedPiece.moveVectors.forEach(vector => [...board.GetCellIndices(vector, pieceLocation)].forEach(dest => destinations.add(dest)));
        checkmatedPiece.moveCaptureVectors.forEach(vector => [...board.GetCellIndices(vector, pieceLocation)].forEach(dest => destinations.add(dest)));
        destinations = [...destinations];
        destinations = destinations.filter(canMoveTo => !Metrics.isCheckedFor(board, canMoveTo, checkmatedPlayer));
        if (destinations.length > 0) {
            return false;
        }

        // 3. Get all pieces checking the target
        const checkingPieces = Metrics.checkedBy(board, pieceLocation);

        if (checkingPieces.size === 1) {
            const checkingPieceLocation = Array.from(checkingPieces.keys())[0];
            // 4. If only 1 checking piece, the checking piece is not itself in check
            if (!Metrics.isCheckedFor(board, checkingPieceLocation, checkmatedPlayer)) {
                return false;
            }            
        }
        
        // 5. All checking vectors do not intersect at a location that can be interrupted
        const checkingVectors = [...checkingPieces.entries()].map(checkSet => {
            const checkLocation = checkSet[0];
            const cellLists = [];
            checkSet[1].forEach(vector => {
                cellLists.push(board.GetCellsOnVectorBetween(vector, checkLocation, pieceLocation));
            });
            return cellLists;
        }).flat(1);
        const interruptablePoints = checkingVectors[0].filter(cell => {
            return checkingVectors.every(cellList => cellList.indexOf(cell) != -1);
        });
        if (interruptablePoints.length > 0) {
            if (interruptablePoints.some(interruptPoint => Metrics.isInfluenced(board, interruptPoint, checkmatedPlayer))) {
                return false;
            }
        }

        return true;
    }
}
