function synthesizeConfig(mockBoard, mockPieces) {
    return `{
        "board": {
            "lengths": [${mockBoard.rows}, ${mockBoard.cols}],
            "adjacencyMatrix": ${mockBoard.createAdjacencyMatrixString()}
        },
        "pieces": [
            ${ mockPieces.map(piece => {
                return `{ "move": "${piece.moveVectors}",` +
                    ` "capture": "${piece.captureVectors}",` + 
                    ` "moveCapture": "${piece.moveCaptureVectors}",` + 
                    ` "identifier": "${piece.identifier}",` +
                    ` "displayAs": "${piece.displayName}"}`;
            }).join(",") }
        ],
        "players": [{
            "identifier": "Blue",
            "color": "#0088FF",
            "direction": [1, 1],
            "dropablePieces": "",
            "capturedPieces": ""
        },
        {
            "identifier": "Red",
            "color": "#FF0000",
            "direction": [1, 1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": true
        }],
        "endConditions": [
            ${ mockPieces.map(piece => {
                if (!piece.royal) {
                    return "";
                }
                return `{ "player": "Red", "win": false, ` + 
                    `"config": "count ${piece.identifier} = 0 @ end Blue"},` + 
                    `{"player": "Blue", "win": false, "config": "count ${piece.identifier} = 0 @ end Red"}`
            }).filter(x => x.length > 0).join(", ") }
        ],
        "boardState": [
            ${ board.contents.map(row => {
                return row.filter(x => x != null).map(item => {
                    return `{"player": "${item.player}", "piece": "${item.piece}", "location": ${item.location}}`;
                }).join(", ");
            }).filter(x => x.length > 0).join(", ") }
        ]
    }`;
}