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
            identifier: "p"
        },
        {
            move: "(1+, 0); (0, 1+):",
            capture: "",
            moveCapture: "(1+, 0); (0, 1+)",
            value: 6,
            identifier: "R"
        },
        {
            move: "(1, 2)j; (2, 1)j",
            capture: "",
            moveCapture: "(1, 2)j; (2, 1)j",
            value: 2,
            identifier: "N"
        },
        {
            move: "(1, 1)+",
            capture: "",
            moveCapture: "(1, 1)+",
            value: 4,
            identifier: "B"
        },
        {
            move: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            capture: "",
            moveCapture: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            value: 4,
            identifier: "C"
        },
        {
            move: "(3, 1)j; (1, 3)j; (1, 1)",
            capture: "",
            moveCapture: "(3, 1)j; (1, 3)j; (1, 1)",
            value: 4,
            identifier: "W"
        },
        {
            move: "(1, 0)+; (0, 1)+; (1, 1)+",
            capture: "",
            moveCapture: "(1, 0)+; (0, 1)+; (1, 1)+",
            value: 12,
            identifier: "Q"
        },
        {
            move: "(1, 0); (0, 1); (1, 1)",
            capture: "",
            moveCapture: "(1, 0); (0, 1); (1, 1)",
            value: 1000,
            identifier: "K"
        }
    ],
    players: [{
            identifier: "Blue",
            color: "#0088FF",
            direction: [1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Red",
            color: "#FF0000",
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
            location: 110
        },
        {
            player: "Blue",
            piece: "p",
            location: 111
        },
        {
            player: "Blue",
            piece: "p",
            location: 112
        },
        {
            player: "Blue",
            piece: "p",
            location: 113
        },
        {
            player: "Blue",
            piece: "p",
            location: 114
        },
        {
            player: "Blue",
            piece: "p",
            location: 115
        },
        {
            player: "Blue",
            piece: "p",
            location: 116
        },
        {
            player: "Blue",
            piece: "p",
            location: 117
        },
        {
            player: "Blue",
            piece: "p",
            location: 118
        },
        {
            player: "Blue",
            piece: "p",
            location: 119
        },
        {
            player: "Blue",
            piece: "C",
            location: 122
        },
        {
            player: "Blue",
            piece: "R",
            location: 123
        },
        {
            player: "Blue",
            piece: "N",
            location: 124
        },
        {
            player: "Blue",
            piece: "B",
            location: 125
        },
        {
            player: "Blue",
            piece: "Q",
            location: 126
        },
        {
            player: "Blue",
            piece: "K",
            location: 127
        },
        {
            player: "Blue",
            piece: "B",
            location: 128
        },
        {
            player: "Blue",
            piece: "N",
            location: 129
        },
        {
            player: "Blue",
            piece: "R",
            location: 130
        },
        {
            player: "Blue",
            piece: "C",
            location: 131
        },
        {
            player: "Blue",
            piece: "W",
            location: 133
        },
        {
            player: "Blue",
            piece: "W",
            location: 144
        },
        {
            player: "Red",
            piece: "p",
            location: 26
        },
        {
            player: "Red",
            piece: "p",
            location: 27
        },
        {
            player: "Red",
            piece: "p",
            location: 28
        },
        {
            player: "Red",
            piece: "p",
            location: 29
        },
        {
            player: "Red",
            piece: "p",
            location: 30
        },
        {
            player: "Red",
            piece: "p",
            location: 31
        },
        {
            player: "Red",
            piece: "p",
            location: 32
        },
        {
            player: "Red",
            piece: "p",
            location: 33
        },
        {
            player: "Red",
            piece: "p",
            location: 34
        },
        {
            player: "Red",
            piece: "p",
            location: 35
        },
        {
            player: "Red",
            piece: "C",
            location: 14
        },
        {
            player: "Red",
            piece: "R",
            location: 15
        },
        {
            player: "Red",
            piece: "N",
            location: 16
        },
        {
            player: "Red",
            piece: "B",
            location: 17
        },
        {
            player: "Red",
            piece: "Q",
            location: 18
        },
        {
            player: "Red",
            piece: "K",
            location: 19
        },
        {
            player: "Red",
            piece: "B",
            location: 20
        },
        {
            player: "Red",
            piece: "N",
            location: 21
        },
        {
            player: "Red",
            piece: "R",
            location: 22
        },
        {
            player: "Red",
            piece: "C",
            location: 23
        },
        {
            player: "Red",
            piece: "W",
            location: 1
        },
        {
            player: "Red",
            piece: "W",
            location: 12
        }
    ]
}


if (typeof window === 'undefined') {
    module.exports.config = config;
}