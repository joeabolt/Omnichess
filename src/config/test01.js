var config_data = {
	board: {
		dimensions: 2,
		lengths: [8, 8],
		adjacencyMatrix: undefined
	},
	pieces: [
		{ // pawn
			move: "(0, 1d)",
			capture: "",
			moveCapture: "(1, 1d)",
			identifier: "p"
		},
		{ // rook
			move: "(1+, 0); (0, 1+):",
			capture: "",
			moveCapture: "(1+, 0); (0, 1+)",
			identifier: "R"
		},
		{ // kniggit
			move: "(1, 2)j; (2, 1)j",
			capture: "",
			moveCapture: "(1, 2)j; (2, 1)j",
			identifier: "N"
		},
		{ // bishop
			move: "(1, 1)+",
			capture: "",
			moveCapture: "(1, 1)+",
			identifier: "B"
		},
		{ // queen
			move: "(1, 0)+; (0, 1)+; (1, 1)+",
			capture: "",
			moveCapture: "(1, 0)+; (0, 1)+; (1, 1)+",
			identifier: "Q"
		},
		{ // king
			move: "(1, 0); (0, 1); (1, 1)",
			capture: "",
			moveCapture: "(1, 0); (0, 1); (1, 1)",
			identifier: "K"
		}
	],
	players: [
		{ // White
			identifier: "White",
			direction: [1, 1],
			dropablePieces: "",
			capturedPieces: ""
		},
		{ // Black
			identifier: "Black",
			direction: [1, -1],
			dropablePieces: "",
			capturedPieces: ""
		}
	],
	endConditions: [
		{
			player: "White",
			win: false,
			config: "count K = 0 @ end Black"
		},
		{
			player: "Black",
			win: false,
			config: "count K = 0 @ end White"
		}
	],
	boardState: [
		{
			player: "White",
			piece: "p",
			location: 48
		},
		{
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
			piece: "R",
			location: 56
		},
		{
			player: "White",
			piece: "N",
			location: 57
		},
		{
			player: "White",
			piece: "B",
			location: 58
		},
		{
			player: "White",
			piece: "Q",
			location: 59
		},
		{
			player: "White",
			piece: "K",
			location: 60
		},
		{
			player: "White",
			piece: "B",
			location: 61
		},
		{
			player: "White",
			piece: "N",
			location: 62
		},
		{
			player: "White",
			piece: "R",
			location: 63
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
			piece: "R",
			location: 0
		},
		{
			player: "Black",
			piece: "N",
			location: 1
		},
		{
			player: "Black",
			piece: "B",
			location: 2
		},
		{
			player: "Black",
			piece: "Q",
			location: 3
		},
		{
			player: "Black",
			piece: "K",
			location: 4
		},
		{
			player: "Black",
			piece: "B",
			location: 5
		},
		{
			player: "Black",
			piece: "N",
			location: 6
		},
		{
			player: "Black",
			piece: "R",
			location: 7
		}
	]
}
