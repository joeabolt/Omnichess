const config = {
    board: {
        lengths: [8, 8],
        adjacencyMatrix: null
    },
    pieces: [{
            move: "(0, 1d); (0, 2di)",
            capture: "",
            moveCapture: "(1, 1d)",
            identifier: "p"
        },
        {
            move: "(1+, 0); (0, 1+):",
            capture: "",
            moveCapture: "(1+, 0); (0, 1+)",
            identifier: "R"
        },
        {
            move: "(1, 2)j; (2, 1)j",
            capture: "",
            moveCapture: "(1, 2)j; (2, 1)j",
            identifier: "N"
        },
        {
            move: "(1, 1)+",
            capture: "",
            moveCapture: "(1, 1)+",
            identifier: "B"
        },
        {
            move: "(1, 0)+; (0, 1)+; (1, 1)+",
            capture: "",
            moveCapture: "(1, 0)+; (0, 1)+; (1, 1)+",
            identifier: "Q"
        },
        {
            move: "(1, 0); (0, 1); (1, 1)",
            capture: "",
            moveCapture: "(1, 0); (0, 1); (1, 1)",
            identifier: "K"
        }
    ],
    players: [{
            identifier: "White",
            color: "#0088FF",
            direction: [1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Black",
            color: "#FF0000",
            direction: [1, 1],
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
            player: "White",
            piece: "p",
            location: 49
        },
        {
            player: "White",
            piece: "p",
            location: 50
        },
        {
            player: "White",
            piece: "p",
            location: 51
        },
        {
            player: "White",
            piece: "p",
            location: 52
        },
        {
            player: "White",
            piece: "p",
            location: 53
        },
        {
            player: "White",
            piece: "p",
            location: 54
        },
        {
            player: "White",
            piece: "p",
            location: 55
        },
        {
            player: "White",
            piece: "p",
            location: 56
        },
        {
            player: "White",
            piece: "R",
            location: 57
        },
        {
            player: "White",
            piece: "N",
            location: 58
        },
        {
            player: "White",
            piece: "B",
            location: 59
        },
        {
            player: "White",
            piece: "Q",
            location: 60
        },
        {
            player: "White",
            piece: "K",
            location: 61
        },
        {
            player: "White",
            piece: "B",
            location: 62
        },
        {
            player: "White",
            piece: "N",
            location: 63
        },
        {
            player: "White",
            piece: "R",
            location: 64
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
            location: 11
        },
        {
            player: "Black",
            piece: "p",
            location: 12
        },
        {
            player: "Black",
            piece: "p",
            location: 13
        },
        {
            player: "Black",
            piece: "p",
            location: 14
        },
        {
            player: "Black",
            piece: "p",
            location: 15
        },
        {
            player: "Black",
            piece: "p",
            location: 16
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
            piece: "B",
            location: 3
        },
        {
            player: "Black",
            piece: "Q",
            location: 4
        },
        {
            player: "Black",
            piece: "K",
            location: 5
        },
        {
            player: "Black",
            piece: "B",
            location: 6
        },
        {
            player: "Black",
            piece: "N",
            location: 7
        },
        {
            player: "Black",
            piece: "R",
            location: 8
        }
    ]
}

if (typeof window === 'undefined') {
    module.exports.config = config;
}