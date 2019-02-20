var config_data = {
	board: {
		dimensions: 2,
		lengths: [10, 10],
		adjacencyMatrix: [[-1,-1,-1,-1,0,1,-1,6,7],[-1,-1,-1,0,1,2,6,7,8],[-1,-1,-1,1,2,3,7,8,9],[-1,-1,-1,2,3,4,8,9,10],[-1,-1,-1,3,4,5,9,10,11],[-1,-1,-1,4,5,-1,10,11,-1],[-1,0,1,-1,6,7,13,14,15],[0,1,2,6,7,8,14,15,16],[1,2,3,7,8,9,15,16,17],[2,3,4,8,9,10,16,17,18],[3,4,5,9,10,11,17,18,19],[4,5,-1,10,11,-1,18,19,20],[-1,-1,-1,-1,12,13,-1,22,23],[-1,-1,6,12,13,14,22,23,24],[-1,6,7,13,14,15,23,24,25],[6,7,8,14,15,16,24,25,26],[7,8,9,15,16,17,25,26,27],[8,9,10,16,17,18,26,27,28],[9,10,11,17,18,19,27,28,29],[10,11,-1,18,19,20,28,29,30],[11,-1,-1,19,20,21,29,30,31],[-1,-1,-1,20,21,-1,30,31,-1],[-1,12,13,-1,22,23,-1,32,33],[12,13,14,22,23,24,32,33,34],[13,14,15,23,24,25,33,34,35],[14,15,16,24,25,26,34,35,-1],[15,16,17,25,26,27,35,-1,-1],[16,17,18,26,27,28,-1,-1,36],[17,18,19,27,28,29,-1,36,37],[18,19,20,28,29,30,36,37,38],[19,20,21,29,30,31,37,38,39],[20,21,-1,30,31,-1,38,39,-1],[-1,22,23,-1,32,33,-1,40,41],[22,23,24,32,33,34,40,41,42],[23,24,25,33,34,35,41,42,43],[24,25,26,34,35,-1,42,43,-1],[27,28,29,-1,36,37,-1,44,45],[28,29,30,36,37,38,44,45,46],[29,30,31,37,38,39,45,46,47],[30,31,-1,38,39,-1,46,47,-1],[-1,32,33,-1,40,41,-1,48,49],[32,33,34,40,41,42,48,49,50],[33,34,35,41,42,43,49,50,51],[34,35,-1,42,43,-1,50,51,52],[-1,36,37,-1,44,45,53,54,55],[36,37,38,44,45,46,54,55,56],[37,38,39,45,46,47,55,56,57],[38,39,-1,46,47,-1,56,57,-1],[-1,40,41,-1,48,49,-1,58,59],[40,41,42,48,49,50,58,59,60],[41,42,43,49,50,51,59,60,61],[42,43,-1,50,51,52,60,61,62],[43,-1,-1,51,52,53,61,62,63],[-1,-1,44,52,53,54,62,63,64],[-1,44,45,53,54,55,63,64,65],[44,45,46,54,55,56,64,65,66],[45,46,47,55,56,57,65,66,67],[46,47,-1,56,57,-1,66,67,-1],[-1,48,49,-1,58,59,-1,-1,-1],[48,49,50,58,59,60,-1,-1,68],[49,50,51,59,60,61,-1,68,69],[50,51,52,60,61,62,68,69,70],[51,52,53,61,62,63,69,70,71],[52,53,54,62,63,64,70,71,72],[53,54,55,63,64,65,71,72,73],[54,55,56,64,65,66,72,73,-1],[55,56,57,65,66,67,73,-1,-1],[56,57,-1,66,67,-1,-1,-1,-1],[59,60,61,-1,68,69,-1,74,75],[60,61,62,68,69,70,74,75,76],[61,62,63,69,70,71,75,76,77],[62,63,64,70,71,72,76,77,78],[63,64,65,71,72,73,77,78,79],[64,65,66,72,73,-1,78,79,-1],[-1,68,69,-1,74,75,-1,-1,-1],[68,69,70,74,75,76,-1,-1,-1],[69,70,71,75,76,77,-1,-1,-1],[70,71,72,76,77,78,-1,-1,-1],[71,72,73,77,78,79,-1,-1,-1],[72,73,-1,78,79,-1,-1,-1,-1]]
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
			color: "#0088FF",
			direction: [1, -1],
			dropablePieces: "",
			capturedPieces: ""
		},
		{ // Black
			identifier: "Black",
			color: "#FF0000",
			direction: [1, 1],
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
			location: 59
		},
		{
			player: "White",
			piece: "p",
			location: 68
		},
		{
			player: "White",
			piece: "p",
			location: 69
		},
		{
			player: "White",
			piece: "p",
			location: 72
		},
		{
			player: "White",
			piece: "p",
			location: 73
		},
		{
			player: "White",
			piece: "p",
			location: 66
		},
		{
			player: "White",
			piece: "p",
			location: 57
		},
		{
			player: "White",
			piece: "B",
			location: 58
		},
		{
			player: "White",
			piece: "B",
			location: 67
		},
		{
			player: "White",
			piece: "B",
			location: 75
		},
		{
			player: "White",
			piece: "B",
			location: 78
		},
		{
			player: "White",
			piece: "R",
			location: 74
		},
		{
			player: "White",
			piece: "R",
			location: 79
		},
		{
			player: "White",
			piece: "N",
			location: 70
		},
		{
			player: "White",
			piece: "N",
			location: 71
		},
		{
			player: "White",
			piece: "K",
			location: 76
		},
		{
			player: "White",
			piece: "Q",
			location: 77
		},
		
		
		
		{
			player: "Black",
			piece: "p",
			location: 22
		},
		{
			player: "Black",
			piece: "p",
			location: 13
		},
		{
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
			location: 20
		},
		{
			player: "Black",
			piece: "p",
			location: 31
		},
		{
			player: "Black",
			piece: "B",
			location: 12
		},
		{
			player: "Black",
			piece: "B",
			location: 21
		},
		{
			player: "Black",
			piece: "B",
			location: 1
		},
		{
			player: "Black",
			piece: "B",
			location: 4
		},
		{
			player: "Black",
			piece: "R",
			location: 0
		},
		{
			player: "Black",
			piece: "R",
			location: 5
		},
		{
			player: "Black",
			piece: "N",
			location: 8
		},
		{
			player: "Black",
			piece: "N",
			location: 9
		},
		{
			player: "Black",
			piece: "K",
			location: 2
		},
		{
			player: "Black",
			piece: "Q",
			location: 3
		}
	]
}
