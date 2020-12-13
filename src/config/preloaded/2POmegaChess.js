const config = {
    board: {
        lengths: [12, 12],
        adjacencyMatrix: [
            [null,null,null,null,1,-2,null,-13,14],
            [null,null,null,1,-2,-3,-13,14,15],
            [null,null,null,-2,-3,-4,14,15,16],
            [null,null,null,-3,-4,-5,15,16,17],
            [null,null,null,-4,-5,-6,16,17,18],
            [null,null,null,-5,-6,-7,17,18,19],
            [null,null,null,-6,-7,-8,18,19,20],
            [null,null,null,-7,-8,-9,19,20,21],
            [null,null,null,-8,-9,-10,20,21,22],
            [null,null,null,-9,-10,-11,21,22,23],
            [null,null,null,-10,-11,12,22,23,-24],
            [null,null,null,-11,12,null,23,-24,null],
            [null,1,-2,null,-13,14,null,-25,26],
            [1,-2,-3,-13,14,15,-25,26,27],
            [-2,-3,-4,14,15,16,26,27,28],
            [-3,-4,-5,15,16,17,27,28,29],
            [-4,-5,-6,16,17,18,28,29,30],
            [-5,-6,-7,17,18,19,29,30,31],
            [-6,-7,-8,18,19,20,30,31,32],
            [-7,-8,-9,19,20,21,31,32,33],
            [-8,-9,-10,20,21,22,32,33,34],
            [-9,-10,-11,21,22,23,33,34,35],
            [-10,-11,12,22,23,-24,34,35,-36],
            [-11,12,null,23,-24,null,35,-36,null],
            [null,-13,14,null,-25,26,null,-37,38],
            [-13,14,15,-25,26,27,-37,38,39],
            [14,15,16,26,27,28,38,39,40],
            [15,16,17,27,28,29,39,40,41],
            [16,17,18,28,29,30,40,41,42],
            [17,18,19,29,30,31,41,42,43],
            [18,19,20,30,31,32,42,43,44],
            [19,20,21,31,32,33,43,44,45],
            [20,21,22,32,33,34,44,45,46],
            [21,22,23,33,34,35,45,46,47],
            [22,23,-24,34,35,-36,46,47,-48],
            [23,-24,null,35,-36,null,47,-48,null],
            [null,-25,26,null,-37,38,null,-49,50],
            [-25,26,27,-37,38,39,-49,50,51],
            [26,27,28,38,39,40,50,51,52],
            [27,28,29,39,40,41,51,52,53],
            [28,29,30,40,41,42,52,53,54],
            [29,30,31,41,42,43,53,54,55],
            [30,31,32,42,43,44,54,55,56],
            [31,32,33,43,44,45,55,56,57],
            [32,33,34,44,45,46,56,57,58],
            [33,34,35,45,46,47,57,58,59],
            [34,35,-36,46,47,-48,58,59,-60],
            [35,-36,null,47,-48,null,59,-60,null],
            [null,-37,38,null,-49,50,null,-61,62],
            [-37,38,39,-49,50,51,-61,62,63],
            [38,39,40,50,51,52,62,63,64],
            [39,40,41,51,52,53,63,64,65],
            [40,41,42,52,53,54,64,65,66],
            [41,42,43,53,54,55,65,66,67],
            [42,43,44,54,55,56,66,67,68],
            [43,44,45,55,56,57,67,68,69],
            [44,45,46,56,57,58,68,69,70],
            [45,46,47,57,58,59,69,70,71],
            [46,47,-48,58,59,-60,70,71,-72],
            [47,-48,null,59,-60,null,71,-72,null],
            [null,-49,50,null,-61,62,null,-73,74],
            [-49,50,51,-61,62,63,-73,74,75],
            [50,51,52,62,63,64,74,75,76],
            [51,52,53,63,64,65,75,76,77],
            [52,53,54,64,65,66,76,77,78],
            [53,54,55,65,66,67,77,78,79],
            [54,55,56,66,67,68,78,79,80],
            [55,56,57,67,68,69,79,80,81],
            [56,57,58,68,69,70,80,81,82],
            [57,58,59,69,70,71,81,82,83],
            [58,59,-60,70,71,-72,82,83,-84],
            [59,-60,null,71,-72,null,83,-84,null],
            [null,-61,62,null,-73,74,null,-85,86],
            [-61,62,63,-73,74,75,-85,86,87],
            [62,63,64,74,75,76,86,87,88],
            [63,64,65,75,76,77,87,88,89],
            [64,65,66,76,77,78,88,89,90],
            [65,66,67,77,78,79,89,90,91],
            [66,67,68,78,79,80,90,91,92],
            [67,68,69,79,80,81,91,92,93],
            [68,69,70,80,81,82,92,93,94],
            [69,70,71,81,82,83,93,94,95],
            [70,71,-72,82,83,-84,94,95,-96],
            [71,-72,null,83,-84,null,95,-96,null],
            [null,-73,74,null,-85,86,null,-97,98],
            [-73,74,75,-85,86,87,-97,98,99],
            [74,75,76,86,87,88,98,99,100],
            [75,76,77,87,88,89,99,100,101],
            [76,77,78,88,89,90,100,101,102],
            [77,78,79,89,90,91,101,102,103],
            [78,79,80,90,91,92,102,103,104],
            [79,80,81,91,92,93,103,104,105],
            [80,81,82,92,93,94,104,105,106],
            [81,82,83,93,94,95,105,106,107],
            [82,83,-84,94,95,-96,106,107,-108],
            [83,-84,null,95,-96,null,107,-108,null],
            [null,-85,86,null,-97,98,null,-109,110],
            [-85,86,87,-97,98,99,-109,110,111],
            [86,87,88,98,99,100,110,111,112],
            [87,88,89,99,100,101,111,112,113],
            [88,89,90,100,101,102,112,113,114],
            [89,90,91,101,102,103,113,114,115],
            [90,91,92,102,103,104,114,115,116],
            [91,92,93,103,104,105,115,116,117],
            [92,93,94,104,105,106,116,117,118],
            [93,94,95,105,106,107,117,118,119],
            [94,95,-96,106,107,-108,118,119,-120],
            [95,-96,null,107,-108,null,119,-120,null],
            [null,-97,98,null,-109,110,null,-121,122],
            [-97,98,99,-109,110,111,-121,122,123],
            [98,99,100,110,111,112,122,123,124],
            [99,100,101,111,112,113,123,124,125],
            [100,101,102,112,113,114,124,125,126],
            [101,102,103,113,114,115,125,126,127],
            [102,103,104,114,115,116,126,127,128],
            [103,104,105,115,116,117,127,128,129],
            [104,105,106,116,117,118,128,129,130],
            [105,106,107,117,118,119,129,130,131],
            [106,107,-108,118,119,-120,130,131,-132],
            [107,-108,null,119,-120,null,131,-132,null],
            [null,-109,110,null,-121,122,null,133,-134],
            [-109,110,111,-121,122,123,133,-134,-135],
            [110,111,112,122,123,124,-134,-135,-136],
            [111,112,113,123,124,125,-135,-136,-137],
            [112,113,114,124,125,126,-136,-137,-138],
            [113,114,115,125,126,127,-137,-138,-139],
            [114,115,116,126,127,128,-138,-139,-140],
            [115,116,117,127,128,129,-139,-140,-141],
            [116,117,118,128,129,130,-140,-141,-142],
            [117,118,119,129,130,131,-141,-142,-143],
            [118,119,-120,130,131,-132,-142,-143,144],
            [119,-120,null,131,-132,null,-143,144,null],
            [null,-121,122,null,133,-134,null,null,null],
            [-121,122,123,133,-134,-135,null,null,null],
            [122,123,124,-134,-135,-136,null,null,null],
            [123,124,125,-135,-136,-137,null,null,null],
            [124,125,126,-136,-137,-138,null,null,null],
            [125,126,127,-137,-138,-139,null,null,null],
            [126,127,128,-138,-139,-140,null,null,null],
            [127,128,129,-139,-140,-141,null,null,null],
            [128,129,130,-140,-141,-142,null,null,null],
            [129,130,131,-141,-142,-143,null,null,null],
            [130,131,-132,-142,-143,144,null,null,null],
            [131,-132,null,-143,144,null,null,null,null]]
    },
    pieces: [{
            move: "(0, 1d); (0, 1{3}di)",
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
            move: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            capture: "",
            moveCapture: "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)",
            identifier: "C"
        },
        {
            move: "(3, 1)j; (1, 3)j; (1, 1)",
            capture: "",
            moveCapture: "(3, 1)j; (1, 3)j; (1, 1)",
            identifier: "W"
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
