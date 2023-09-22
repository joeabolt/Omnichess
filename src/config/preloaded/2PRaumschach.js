const config = {
    board: {
        lengths: [5, 5, 5],
        adjacencyMatrix: null
    },
    pieces: [{
            move: "(0, 0, 1d); (0, 1d, 0)",
            capture: "",
            moveCapture: "(1, 1d, 0); (1, 0, 1d); (0, 1d, 1d)",
            identifier: "p",
            image: "Pawn"
        },
        {
            move: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            capture: "",
            moveCapture: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            identifier: "R",
            image: "Rook"
        },
        {
            move: "(0, 1, 2)j; (0, 2, 1)j; (1, 0, 2)j; (1, 2, 0)j; (2, 0, 1)j; (2, 1, 0)j;",
            capture: "",
            moveCapture: "(0, 1, 2)j; (0, 2, 1)j; (1, 0, 2)j; (1, 2, 0)j; (2, 0, 1)j; (2, 1, 0)j;",
            identifier: "N",
            image: "Knight"
        },
        {
            move: "(1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+",
            capture: "",
            moveCapture: "(1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+",
            identifier: "B",
            image: "Bishop"
        },
        {
            move: "(1, 1, 1)+",
            capture: "",
            moveCapture: "(1, 1, 1)+",
            identifier: "U",
            image: "Unicorn"
        },
        {
            move: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+; (1, 1, 1)+",
            capture: "",
            moveCapture: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+; (1, 1, 1)+",
            identifier: "Q",
            image: "Queen"
        },
        {
            move: "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0); (1, 0, 1); (0, 1, 1); (1, 1, 1)",
            capture: "",
            moveCapture: "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0); (1, 0, 1); (0, 1, 1); (1, 1, 1)",
            identifier: "K",
            image: "King"
        }
    ],
    players: [{
            identifier: "White",
            color: "#0088FF",
            imgStyle: "light",
            direction: [1, -1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Black",
            color: "#FF0000",
            imgStyle: "dark",
            direction: [1, 1, 1],
            dropablePieces: "",
            capturedPieces: ""
        }
    ],
    endConditions: [{
            player: "White",
            win: false,
            config: "check K @ end Black"
        },
        {
            player: "Black",
            win: false,
            config: "check K @ end White"
        }
    ],
    boardState: [{
            player: "Black",
            piece: "p",
            location: 6
        },
        {
            player: "Black",
            piece: "p",
            location: 7
        },
        {
            player: "Black",
            piece: "p",
            location: 8
        },
        {
            player: "Black",
            piece: "p",
            location: 9
        },
        {
            player: "Black",
            piece: "p",
            location: 10
        },
        {
            player: "Black",
            piece: "p",
            location: 31
        },
        {
            player: "Black",
            piece: "p",
            location: 32
        },
        {
            player: "Black",
            piece: "p",
            location: 33
        },
        {
            player: "Black",
            piece: "p",
            location: 34
        },
        {
            player: "Black",
            piece: "p",
            location: 35
        },
        {
            player: "Black",
            piece: "R",
            location: 1
        },
        {
            player: "Black",
            piece: "N",
            location: 2
        },
        {
            player: "Black",
            piece: "K",
            location: 3
        },
        {
            player: "Black",
            piece: "N",
            location: 4
        },
        {
            player: "Black",
            piece: "R",
            location: 5
        },
        {
            player: "Black",
            piece: "U",
            location: 26
        },
        {
            player: "Black",
            piece: "B",
            location: 27
        },
        {
            player: "Black",
            piece: "Q",
            location: 28
        },
        {
            player: "Black",
            piece: "U",
            location: 29
        },
        {
            player: "Black",
            piece: "B",
            location: 30
        },
        {
            player: "White",
            piece: "p",
            location: 91
        },
        {
            player: "White",
            piece: "p",
            location: 92
        },
        {
            player: "White",
            piece: "p",
            location: 93
        },
        {
            player: "White",
            piece: "p",
            location: 94
        },
        {
            player: "White",
            piece: "p",
            location: 95
        },
        {
            player: "White",
            piece: "p",
            location: 116
        },
        {
            player: "White",
            piece: "p",
            location: 117
        },
        {
            player: "White",
            piece: "p",
            location: 118
        },
        {
            player: "White",
            piece: "p",
            location: 119
        },
        {
            player: "White",
            piece: "p",
            location: 120
        },
        {
            player: "White",
            piece: "R",
            location: 121
        },
        {
            player: "White",
            piece: "N",
            location: 122
        },
        {
            player: "White",
            piece: "K",
            location: 123
        },
        {
            player: "White",
            piece: "N",
            location: 124
        },
        {
            player: "White",
            piece: "R",
            location: 125
        },
        {
            player: "White",
            piece: "B",
            location: 96
        },
        {
            player: "White",
            piece: "U",
            location: 97
        },
        {
            player: "White",
            piece: "Q",
            location: 98
        },
        {
            player: "White",
            piece: "B",
            location: 99
        },
        {
            player: "White",
            piece: "U",
            location: 100
        }
    ]
}


if (typeof window === 'undefined') {
    module.exports.config = config;
}