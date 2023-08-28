const config = {
    "board": {
        "lengths": [12, 11],
        "adjacencyMatrix": null,
        "type": "hex",
        "orientation": "horizontal",
        "oob": [1, 2, 3, 10, 11, 12, 13, 14, 22, 23, 24, 25, 34, 35, 36, 46, 47, 58, 70, 81, 82, 92, 93, 94, 
            103, 104, 105, 106, 114, 115, 116, 117, 118, 125, 126, 127]
    },
    "pieces": [
        {
            "move": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            "capture": "",
            "moveCapture": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            "identifier": "R"
        },
        {
            "move": "(2, 1, 0)sj; (2, 0, 1)sj; (1, 2, 0)sj; (1, 0, 2)sj; (0, -1, 2)sj; (0, 2, -1)sj;",
            "capture": "",
            "moveCapture": "(2, 1, 0)sj; (2, 0, 1)sj; (1, 2, 0)sj; (1, 0, 2)sj; (0, -1, 2)sj; (0, 2, -1)sj;",
            "identifier": "N"
        },
        {
            "move": "(1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "capture": "",
            "moveCapture": "(1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "identifier": "B"
        },
        {
            "move": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "capture": "",
            "moveCapture": "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)s+; (1, 0, 1)s+; (0, 1, -1)s+",
            "identifier": "Q"
        },
        {
            "move": "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0)s; (1, 0, 1)s; (0, 1, -1)s",
            "capture": "",
            "moveCapture": "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0)s; (1, 0, 1)s; (0, 1, -1)s",
            "identifier": "K"
        },
        {
            "move": "(1d, 0, 0); (2di, 0, 0);",
            "capture": "",
            "moveCapture": "(0, 0, 1d); (0, 1d, 0)",
            "identifier": "p"
        }
    ],
    "players": [{
            "identifier": "Green",
            "color": "#00FF00",
            "direction": [1, 1, 1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": false
        },
        {
            "identifier": "Orange",
            "color": "#FFAA00",
            "direction": [-1, -1, -1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": false
        }
    ],
    "endConditions": [{
            "player": "Green",
            "win": false,
            "config": "check K @ end Orange"
        },
        {
            "player": "Orange",
            "win": false,
            "config": "check K @ end Green"
        }
    ],
    "boardState": [
        {
            "player": "Green",
            "piece": "B",
            "location": 59
        },
        {
            "player": "Green",
            "piece": "B",
            "location": 60
        },
        {
            "player": "Green",
            "piece": "B",
            "location": 61
        },
        {
            "player": "Green",
            "piece": "Q",
            "location": 48
        },
        {
            "player": "Green",
            "piece": "K",
            "location": 71
        },
        {
            "player": "Green",
            "piece": "N",
            "location": 37
        },
        {
            "player": "Green",
            "piece": "N",
            "location": 83
        },
        {
            "player": "Green",
            "piece": "R",
            "location": 26
        },
        {
            "player": "Green",
            "piece": "R",
            "location": 95
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 15
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 27
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 39
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 51
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 63
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 74
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 85
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 96
        },
        {
            "player": "Green",
            "piece": "p",
            "location": 107
        },
        {
            "player": "Orange",
            "piece": "B",
            "location": 69
        },
        {
            "player": "Orange",
            "piece": "B",
            "location": 68
        },
        {
            "player": "Orange",
            "piece": "B",
            "location": 67
        },
        {
            "player": "Orange",
            "piece": "Q",
            "location": 57
        },
        {
            "player": "Orange",
            "piece": "K",
            "location": 80
        },
        {
            "player": "Orange",
            "piece": "N",
            "location": 45
        },
        {
            "player": "Orange",
            "piece": "N",
            "location": 91
        },
        {
            "player": "Orange",
            "piece": "R",
            "location": 33
        },
        {
            "player": "Orange",
            "piece": "R",
            "location": 102
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 21
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 32
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 43
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 54
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 65
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 77
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 89
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 101
        },
        {
            "player": "Orange",
            "piece": "p",
            "location": 113
        }
    ]
}

if (typeof window === 'undefined') {
    module.exports.config = config;
}