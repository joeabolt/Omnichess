const config = {
    board: {
        lengths: [5, 5, 5],
        adjacencyMatrix: null
    },
    pieces: [{
            move: "(0, 0, 1d); (0, 1d, 0)",
            capture: "",
            moveCapture: "(1, 1d, 0); (1, 0, 1d); (0, 1d, 1d)",
            value: 1,
            identifier: "p"
        },
        {
            move: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            capture: "",
            moveCapture: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+)",
            value: 3,
            identifier: "R"
        },
        {
            move: "(0, 1, 2)j; (0, 2, 1)j; (1, 0, 2)j; (1, 2, 0)j; (2, 0, 1)j; (2, 1, 0)j;",
            capture: "",
            moveCapture: "(0, 1, 2)j; (0, 2, 1)j; (1, 0, 2)j; (1, 2, 0)j; (2, 0, 1)j; (2, 1, 0)j;",
            value: 4,
            identifier: "N"
        },
        {
            move: "(1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+",
            capture: "",
            moveCapture: "(1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+",
            value: 3.75,
            identifier: "B"
        },
        {
            move: "(1, 1, 1)+",
            capture: "",
            moveCapture: "(1, 1, 1)+",
            value: 1.75,
            identifier: "U"
        },
        {
            move: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+; (1, 1, 1)+",
            capture: "",
            moveCapture: "(1+, 0, 0); (0, 1+, 0); (0, 0, 1+); (1, 1, 0)+; (1, 0, 1)+; (0, 1, 1)+; (1, 1, 1)+",
            value: 10,
            identifier: "Q"
        },
        {
            move: "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0); (1, 0, 1); (0, 1, 1); (1, 1, 1)",
            capture: "",
            moveCapture: "(1, 0, 0); (0, 1, 0); (0, 0, 1); (1, 1, 0); (1, 0, 1); (0, 1, 1); (1, 1, 1)",
            value: 1000,
            identifier: "K"
        }
    ],
    players: [{
            identifier: "Blue",
            color: "#0088FF",
            direction: [1, -1, -1],
            dropablePieces: "",
            capturedPieces: ""
        },
        {
            identifier: "Red",
            color: "#FF0000",
            direction: [1, 1, 1],
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
            player: "Red",
            piece: "p",
            location: 6
        },
        {
            player: "Red",
            piece: "p",
            location: 7
        },
        {
            player: "Red",
            piece: "p",
            location: 8
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
            piece: "K",
            location: 3
        },
        {
            player: "Red",
            piece: "N",
            location: 4
        },
        {
            player: "Red",
            piece: "R",
            location: 5
        },
        {
            player: "Red",
            piece: "U",
            location: 26
        },
        {
            player: "Red",
            piece: "B",
            location: 27
        },
        {
            player: "Red",
            piece: "Q",
            location: 28
        },
        {
            player: "Red",
            piece: "U",
            location: 29
        },
        {
            player: "Red",
            piece: "B",
            location: 30
        },
        
        
        
        
        {
            player: "Blue",
            piece: "p",
            location: 91
        },
        {
            player: "Blue",
            piece: "p",
            location: 92
        },
        {
            player: "Blue",
            piece: "p",
            location: 93
        },
        {
            player: "Blue",
            piece: "p",
            location: 94
        },
        {
            player: "Blue",
            piece: "p",
            location: 95
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
            piece: "p",
            location: 120
        },
        {
            player: "Blue",
            piece: "R",
            location: 121
        },
        {
            player: "Blue",
            piece: "N",
            location: 122
        },
        {
            player: "Blue",
            piece: "K",
            location: 123
        },
        {
            player: "Blue",
            piece: "N",
            location: 124
        },
        {
            player: "Blue",
            piece: "R",
            location: 125
        },
        {
            player: "Blue",
            piece: "B",
            location: 96
        },
        {
            player: "Blue",
            piece: "U",
            location: 97
        },
        {
            player: "Blue",
            piece: "Q",
            location: 98
        },
        {
            player: "Blue",
            piece: "B",
            location: 99
        },
        {
            player: "Blue",
            piece: "U",
            location: 100
        }
        
        
    ]
}

if (typeof window === 'undefined') {
    module.exports.config = config;
}