const config = {
    "board": {
        "lengths": [12, 11],
        "adjacencyMatrix": null,
        "type": "hex",
        "orientation": "vertical",
        "oob": [1, 2, 3, 10, 11, 12, 13, 14, 22, 23, 24, 25, 34, 35, 36, 46, 47, 58, 70, 81, 82, 92, 93, 94, 
            103, 104, 105, 106, 114, 115, 116, 117, 118, 125, 126, 127]
    },
    "pieces": [
        {
            "move": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            "capture": "",
            "moveCapture": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            "identifier": "R",
            "image": "Rook"
        },
        {
            "move": "(2, 1, 0)sj; (2, 0, 1)sj; (1, 2, 0)sj; (1, 0, 2)sj; (0, -1, 2)sj; (0, 2, -1)sj;",
            "capture": "",
            "moveCapture": "(2, 1, 0)sj; (2, 0, 1)sj; (1, 2, 0)sj; (1, 0, 2)sj; (0, -1, 2)sj; (0, 2, -1)sj;",
            "identifier": "N",
            "image": "Knight"
        },
        {
            "move": "(1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "capture": "",
            "moveCapture": "(1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "identifier": "B",
            "image": "Bishop"
        },
        {
            "move": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "capture": "",
            "moveCapture": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "identifier": "Q",
            "image": "Queen"
        },
        {
            "move": "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0)s; (1, 0, 1)s; (0, 1, -1)s",
            "capture": "",
            "moveCapture": "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0)s; (1, 0, 1)s; (0, 1, -1)s",
            "identifier": "K",
            "image": "King"
        },
        {
            "move": "(1d, 0, 0); (2di, 0, 0);",
            "capture": "",
            "moveCapture": "(0, 0, 1d); (0, 1d, 0)",
            "identifier": "p",
            "image": "Pawn"
        }
    ],
    "players": [{
            "identifier": "White",
            "color": "#0000FF",
            "direction": [-1, -1, -1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": false,
            imgStyle: "light",
        },
        {
            "identifier": "Black",
            "color": "#FF0000",
            "direction": [1, 1, 1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": true,
            imgStyle: "dark",
        }
    ],
    "endConditions": [{
            "player": "Black",
            "win": false,
            "config": "check K @ end White"
        },
        {
            "player": "White",
            "win": false,
            "config": "check K @ end Black"
        }
    ],
    "boardState": [
        {
            "player": "Black",
            "piece": "B",
            "location": 59
        },
        {
            "player": "Black",
            "piece": "B",
            "location": 60
        },
        {
            "player": "Black",
            "piece": "B",
            "location": 61
        },
        {
            "player": "Black",
            "piece": "Q",
            "location": 48
        },
        {
            "player": "Black",
            "piece": "K",
            "location": 71
        },
        {
            "player": "Black",
            "piece": "N",
            "location": 37
        },
        {
            "player": "Black",
            "piece": "N",
            "location": 83
        },
        {
            "player": "Black",
            "piece": "R",
            "location": 26
        },
        {
            "player": "Black",
            "piece": "R",
            "location": 95
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 15
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 27
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 39
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 51
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 63
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 74
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 85
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 96
        },
        {
            "player": "Black",
            "piece": "p",
            "location": 107
        },
        {
            "player": "White",
            "piece": "B",
            "location": 69
        },
        {
            "player": "White",
            "piece": "B",
            "location": 68
        },
        {
            "player": "White",
            "piece": "B",
            "location": 67
        },
        {
            "player": "White",
            "piece": "Q",
            "location": 57
        },
        {
            "player": "White",
            "piece": "K",
            "location": 80
        },
        {
            "player": "White",
            "piece": "N",
            "location": 45
        },
        {
            "player": "White",
            "piece": "N",
            "location": 91
        },
        {
            "player": "White",
            "piece": "R",
            "location": 33
        },
        {
            "player": "White",
            "piece": "R",
            "location": 102
        },
        {
            "player": "White",
            "piece": "p",
            "location": 21
        },
        {
            "player": "White",
            "piece": "p",
            "location": 32
        },
        {
            "player": "White",
            "piece": "p",
            "location": 43
        },
        {
            "player": "White",
            "piece": "p",
            "location": 54
        },
        {
            "player": "White",
            "piece": "p",
            "location": 65
        },
        {
            "player": "White",
            "piece": "p",
            "location": 77
        },
        {
            "player": "White",
            "piece": "p",
            "location": 89
        },
        {
            "player": "White",
            "piece": "p",
            "location": 101
        },
        {
            "player": "White",
            "piece": "p",
            "location": 113
        }
    ]
}

if (typeof window === 'undefined') {
    module.exports.config = config;
}