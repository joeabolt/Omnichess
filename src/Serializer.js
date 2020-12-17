/* Provides utilities to serialize a game out to a JSON file */
class Serializer {
    /**
     * Given a game, outputs a JSON object that can be saved to a file.
     * The returned object is a valid configuration file for Omnichess,
     * and will result in a game in the same state as the game passed
     * into this funcion.
     */
    static Serialize(game) {
        const output = {};

        /* Serialize the board (shape, not state) */
        output.board = {};
        output.board.lengths = MatrixUtilities.GetLengths(game.board.ConvertToArray());
        output.board.adjacencyMatrix = game.board.cells;

        /* Serialize pieces */
        output.pieces = [];
        for (let i = 0; i < game.board.contents.length; i++) {
            const piece = game.board.contents[i];
            if (piece === undefined) {
                continue;
            }
            if (output.pieces.some((template) => template.identifier === piece.identifier)) {
                continue;
            }
            const template = {};

            piece.undoDirection();
            const moves = piece.moves;
            piece.setMoves(moves * -1);
            template.move = piece.moveVectors.map(vector => vector.toString()).join(";");
            template.capture = piece.captureVectors.map(vector => vector.toString()).join(";");
            template.moveCapture = piece.moveCaptureVectors.map(vector => vector.toString()).join(";");
            template.identifier = piece.identifier;
            piece.setMoves(moves);

            output.pieces.push(template);
        }

        /* Serialize the players (does not preserve current turn) */
        output.players = [];
        for (let i = 0; i < game.players.length; i++) {
            const player = game.turnOrder[(game.turnIndex + i) % game.turnOrder.length].player
            const template = {};

            template.identifier = player.identifier;
            template.color = player.color;
            template.direction = player.direction;
            template.dropablePieces = "";
            template.capturedPieces = "";
            if (player.isCPU) {
                template.isCPU = true;
                template.caution = player.caution;
                template.weightCapture = player.weightCaptures;
                template.weightControl = player.weightControl;
            }

            output.players.push(template);
        }

        /* Serialize the end conditions */
        output.endConditions = [];
        for (let i = 0; i < game.endConditions.length; i++) {
            const endCondition = game.endConditions[i];
            const template = {};

            template.player = endCondition.player.identifier;
            template.win = endCondition.state === 1;
            template.config = endCondition.configurationString;

            output.endConditions.push(template);
        }

        /* Serialize the board state */
        output.boardState = [];
        for (let i = 0; i < game.board.contents.length; i++) {
            const piece = game.board.contents[i];
            if (piece === undefined) {
                continue;
            }
            const data = {};

            data.player = piece.player.identifier;
            data.piece = piece.identifier;
            data.location = i;
            data.hasMoved = piece.moves > 0;

            output.boardState.push(data);
        }

        return output;
    }
}
