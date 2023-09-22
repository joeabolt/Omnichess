const config = {
    board: {
        lengths: [12, 12],
        adjacencyMatrix: null,
        oob: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 24, 25, 
            36, 37, 48, 49, 60, 61, 72, 73, 84, 85, 96, 97, 
            108, 109, 120, 121, 132, 134, 135, 136, 137, 
            138, 139, 140, 141, 142, 143]
    },
    pieces: [{
            move: "(0, 1d); (0, 1{3}di)",
            capture: "",
            moveCapture: "(1, 1d)",
            value: 1,
            identifier: "p",
            image: "Pawn"
        },
        {
            move: "(1+, 0); (0, 1+):",
            capture: "",
            moveCapture: "(1+, 0); (0, 1+)",
            value: 6,
            identifier: "R",
            image: "Rook"
        },
        {
            move: "(1, 2)j; (2, 1)j",
            capture: "",
            moveCapture: "(1, 2)j; (2, 1)j",
            value: 2,
            identifier: "N",
            image: "Knight"
        },
        {
            move: "(1, 1)+",
            capture: "",
            moveCapture: "(1, 1)+",
            value: 4,
            identifier: "B",
            image: "Bishop"
        },
        {
            move: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            capture: "",
            moveCapture: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            value: 4,
            identifier: "C",
            image: "Champion"
        },
        {
            move: "(3, 1)j; (1, 3)j; (1, 1)",
            capture: "",
            moveCapture: "(3, 1)j; (1, 3)j; (1, 1)",
            value: 4,
            identifier: "W",
            image: "Wizard"
        },
        {
            move: "(1, 0)+; (0, 1)+; (1, 1)+",
            capture: "",
            moveCapture: "(1, 0)+; (0, 1)+; (1, 1)+",
            value: 12,
            identifier: "Q",
            image: "Queen"
        },
        {
            move: "(1, 0); (0, 1); (1, 1)",
            capture: "",
            moveCapture: "(1, 0); (0, 1); (1, 1)",
            value: 1000,
            identifier: "K",
            image: "King"
        }
    ],
    players: [{
            identifier: "White",
            color: "#0088FF",
            imgStyle: "light",
            direction: [1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Black",
            color: "#FF0000",
            imgStyle: "dark",
            direction: [1, 1],
            dropablePieces: "",
            capturedPieces: "",
            isCPU: true
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
            player: "White",
            piece: "p",
            location: 110
        },
        {
            player: "White",
            piece: "p",
            location: 111
        },
        {
            player: "White",
            piece: "p",
            location: 112
        },
        {
            player: "White",
            piece: "p",
            location: 113
        },
        {
            player: "White",
            piece: "p",
            location: 114
        },
        {
            player: "White",
            piece: "p",
            location: 115
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
            piece: "C",
            location: 122
        },
        {
            player: "White",
            piece: "R",
            location: 123
        },
        {
            player: "White",
            piece: "N",
            location: 124
        },
        {
            player: "White",
            piece: "B",
            location: 125
        },
        {
            player: "White",
            piece: "Q",
            location: 126
        },
        {
            player: "White",
            piece: "K",
            location: 127
        },
        {
            player: "White",
            piece: "B",
            location: 128
        },
        {
            player: "White",
            piece: "N",
            location: 129
        },
        {
            player: "White",
            piece: "R",
            location: 130
        },
        {
            player: "White",
            piece: "C",
            location: 131
        },
        {
            player: "White",
            piece: "W",
            location: 133
        },
        {
            player: "White",
            piece: "W",
            location: 144
        },
        {
            player: "Black",
            piece: "p",
            location: 26
        },
        {
            player: "Black",
            piece: "p",
            location: 27
        },
        {
            player: "Black",
            piece: "p",
            location: 28
        },
        {
            player: "Black",
            piece: "p",
            location: 29
        },
        {
            player: "Black",
            piece: "p",
            location: 30
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
            piece: "C",
            location: 14
        },
        {
            player: "Black",
            piece: "R",
            location: 15
        },
        {
            player: "Black",
            piece: "N",
            location: 16
        },
        {
            player: "Black",
            piece: "B",
            location: 17
        },
        {
            player: "Black",
            piece: "Q",
            location: 18
        },
        {
            player: "Black",
            piece: "K",
            location: 19
        },
        {
            player: "Black",
            piece: "B",
            location: 20
        },
        {
            player: "Black",
            piece: "N",
            location: 21
        },
        {
            player: "Black",
            piece: "R",
            location: 22
        },
        {
            player: "Black",
            piece: "C",
            location: 23
        },
        {
            player: "Black",
            piece: "W",
            location: 1
        },
        {
            player: "Black",
            piece: "W",
            location: 12
        }
    ]
}


if (typeof window === 'undefined') {
    module.exports.config = config;
}