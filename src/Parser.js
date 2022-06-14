/* Class to create game resources based on a json file */
class Parser  {
    static Load(config_data) {
        /* Build the board */
        const boardTemplate = config_data.board;
        let board = undefined;
        if (boardTemplate.type && boardTemplate.type == "hex") {
            // Hex board
            if (boardTemplate.adjacencyMatrix) {
                // Accept input
                board = new HexBoard(boardTemplate.adjacencyMatrix);
            } else {
                // Auto-generate
                board = new HexBoard(HexBoard.Generate(boardTemplate.lengths, boardTemplate.orientation, boardTemplate.oob));
            }
        } else {
            // Square board
            if (boardTemplate.adjacencyMatrix) {
                // Accept input
                board = new Board(boardTemplate.adjacencyMatrix);
            } else {
                // Auto-generate
                board = new Board(Board.Generate(boardTemplate.lengths));
            }
        }

        /* Build the players */
        const players = new Map();
        config_data.players.forEach((template) => {
            // TODO: Magically parse the lists of dropable and captured pieces
            let newPlayer = new Player(template.identifier, template.direction, [], [], template.color);
            if (template.isCPU && template.isCPU === true) {
                /* Handle CPUs and their parameters */
                newPlayer = new CPU(template.identifier, template.direction, [], [], template.color);
                if (template.caution) {
                    newPlayer.SetCaution(template.caution);
                }
                if (template.captureWeight) {
                    newPlayer.SetCaptureWeight(template.captureWeight);
                }
                if (template.moveWeight) {
                    newPlayer.SetMoveWeight(template.moveWeight);
                }
                if (template.controlWeight) {
                    newPlayer.SetControlWeight(template.controlWeight);
                }
                if (template.influenceWeight) {
                    newPlayer.SetInfluenceWeight(template.influenceWeight);
                }
            }
            players.set(template.identifier, newPlayer);
        });

        /* Build end conditions */
        const endConditions = []; // no map, since it will not be accessed later
        config_data.endConditions.forEach((template) => {
            endConditions.push(new EndCondition(players.get(template.player), template.win, template.config));
        });
        const royals = [...new Set(endConditions.map(condition => condition.pieceType))];
        
        /* Load piece identifiers mapped to their templates */
        const pieceTemplates = new Map();
        config_data.pieces.forEach((template) => {
            if (template.value == null) {
                const vectors = Vector.Create(template.move)
                        .concat(Vector.Create(template.capture))
                        .concat(Vector.Create(template.moveCapture));
                const maxDestinations = [...new Set(vectors.map(vector => board.GetCellIndices(vector, board.sink, true, false)).flat())];
                const minDestinations = [...new Set(vectors.map(vector => board.GetCellIndices(vector, board.source, true, false)).flat())];
                let value = (maxDestinations.length + minDestinations.length) / 4;
                if (royals.indexOf(template.identifier) != -1) {
                    value = value + 1000;
                }
                template.value = value;
            }
            pieceTemplates.set(template.identifier, template);
        });

        /* Initialize the board */
        config_data.boardState.forEach((entry) => {
            const piece = new Piece()
                .setIdentifier(entry.piece)
                .setPlayer(players.get(entry.player))
                .setMoveVectors(Vector.Create(pieceTemplates.get(entry.piece).move))
                .setCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).capture))
                .setMoveCaptureVectors(Vector.Create(pieceTemplates.get(entry.piece).moveCapture))
                .setValue(pieceTemplates.get(entry.piece).value);
            piece.setDirection(piece.player.direction);
            if (entry.hasMoved) {
                piece.setMoves(1);
            }
            board.contents[entry.location] = piece;
        });

        /* Build the game */
        const playerList = [];
        players.forEach((value, key) => playerList.push(value));
        const game = new Game(board, playerList, endConditions);

        return game;
    }
}
