const config = {
    board: {
        lengths: [8, 8],
        adjacencyMatrix: null
    },
    pieces: [{
            move: "(0, 1d); (0, 2di)",
            capture: "",
            moveCapture: "(1, 1d)",
            "value": 1,
            identifier: "p",
            image: "Pawn"
        },
        {
            move: "(1+, 0); (0, 1+):",
            capture: "",
            moveCapture: "(1+, 0); (0, 1+)",
            "value": 5,
            identifier: "R",
            image: "Rook"
        },
        {
            move: "(1, 2)j; (2, 1)j",
            capture: "",
            moveCapture: "(1, 2)j; (2, 1)j",
            "value": 3,
            identifier: "N",
            image: "Knight"
        },
        {
            move: "(1, 1)+",
            capture: "",
            moveCapture: "(1, 1)+",
            "value": 3,
            identifier: "B",
            image: "Bishop"
        },
        {
            move: "(1, 0)+; (0, 1)+; (1, 1)+",
            capture: "",
            moveCapture: "(1, 0)+; (0, 1)+; (1, 1)+",
            "value": 9,
            identifier: "Q",
            image: "Queen"
        },
        {
            move: "(1, 0); (0, 1); (1, 1)",
            capture: "",
            moveCapture: "(1, 0); (0, 1); (1, 1)",
            "value": 1000,
            identifier: "K",
            image: "King"
        }
    ],
    players: [{
            identifier: "Blue",
            color: "#0088FF",
            imgStyle: "light",
            direction: [1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Red",
            color: "#FF0000",
            imgStyle: "dark",
            direction: [1, 1],
            dropablePieces: "",
            capturedPieces: "",
            isCPU: true
        }
    ],
    endConditions: [{
            player: "Blue",
            win: false,
            config: "check K @ end Red"
        },
        {
            player: "Red",
            win: false,
            config: "check K @ end Blue"
        }
    ],
    boardState: [{
            player: "Blue",
            piece: "p",
            location: 49
        },
        {
            player: "Blue",
            piece: "p",
            location: 50
        },
        {
            player: "Blue",
            piece: "p",
            location: 51
        },
        {
            player: "Blue",
            piece: "p",
            location: 52
        },
        {
            player: "Blue",
            piece: "p",
            location: 53
        },
        {
            player: "Blue",
            piece: "p",
            location: 54
        },
        {
            player: "Blue",
            piece: "p",
            location: 55
        },
        {
            player: "Blue",
            piece: "p",
            location: 56
        },
        {
            player: "Blue",
            piece: "R",
            location: 57
        },
        {
            player: "Blue",
            piece: "N",
            location: 58
        },
        {
            player: "Blue",
            piece: "B",
            location: 59
        },
        {
            player: "Blue",
            piece: "Q",
            location: 60
        },
        {
            player: "Blue",
            piece: "K",
            location: 61
        },
        {
            player: "Blue",
            piece: "B",
            location: 62
        },
        {
            player: "Blue",
            piece: "N",
            location: 63
        },
        {
            player: "Blue",
            piece: "R",
            location: 64
        },
        {
            player: "Red",
            piece: "p",
            location: 9
        },
        {
            player: "Red",
            piece: "p",
            location: 10
        },
        {
            player: "Red",
            piece: "p",
            location: 11
        },
        {
            player: "Red",
            piece: "p",
            location: 12
        },
        {
            player: "Red",
            piece: "p",
            location: 13
        },
        {
            player: "Red",
            piece: "p",
            location: 14
        },
        {
            player: "Red",
            piece: "p",
            location: 15
        },
        {
            player: "Red",
            piece: "p",
            location: 16
        },
        {
            player: "Red",
            piece: "R",
            location: 1
        },
        {
            player: "Red",
            piece: "N",
            location: 2
        },
        {
            player: "Red",
            piece: "B",
            location: 3
        },
        {
            player: "Red",
            piece: "Q",
            location: 4
        },
        {
            player: "Red",
            piece: "K",
            location: 5
        },
        {
            player: "Red",
            piece: "B",
            location: 6
        },
        {
            player: "Red",
            piece: "N",
            location: 7
        },
        {
            player: "Red",
            piece: "R",
            location: 8
        }
    ]
}


if (typeof window === 'undefined') {
    module.exports.config = config;
}