/** Mock Board class */
class MockBoard  {
	constructor(rows, cols) {
		this.makeNewBoard(rows, cols);
	}
	
	setRows(nrows) {
		this.makeNewBoard(nrows, this.cols);
	}
	
	setCols(ncols) {
		this.makeNewBoard(this.rows, ncols);
	}

	getFalseCells() {
		const falseCells = [];
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols; c++) {
				if (!this.cells[r][c]) {
					falseCells.push(r * this.cols + c + 1);
				}
			}
		}
		return falseCells;
	}
	
	makeNewBoard(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.cells = new Array(this.rows);
        this.contents = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
            this.cells[i] = new Array(this.cols).fill(true);
            this.contents[i] = new Array(this.cols).fill(null);
        }
	}

	getCellIndex(row, column) {
		if (row === -1 || column === -1) {
			return null;
		}
		const value = column + this.cols * row + 1;
		if (!this.cells[row][column])
			return -1 * value;
		return value;
	}
}

class MockPiece {
    constructor() {
        this.moveVectors = "";
        this.captureVectors = "";
        this.moveCaptureVectors = "";
        this.identifier = "";
        this.displayName = "";
        this.royal = false;
    }
}

/* Initialize main variables */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "18px Arial";
let cellSize = 50;
let board = new MockBoard(8, 8);
let pieceTypes = [];
let player = 0;
let mode = 0; // 0 => Activate / Deactivate; >0 => toggle pieceTypes[mode - 1]
let p2IsCpu = true;
updateBoard();

function updateP2() {
	p2IsCpu = !p2IsCpu;
}

function setPlayer(n) {
	player = n;
}

function updateBoardSize() {
	const rows = parseInt(document.getElementById("rows").value);
	const cols = parseInt(document.getElementById("cols").value);
	board.setRows(rows);
	board.setCols(cols);
	updateBoard();
}

function updateCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	cellSize = parseInt(document.getElementById("gridwidth").value);
	const rows = parseInt(document.getElementById("rows").value);
	const cols = parseInt(document.getElementById("cols").value);
	canvas.width = cols * cellSize;
	canvas.height = rows * cellSize;
}

function drawGridLines() {
	let ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#BBBBBB";
	for(let i = 0; i < canvas.width; i+=cellSize) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
		ctx.stroke();
	}
	for(let i = 0; i < canvas.height; i+=cellSize) {
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
		ctx.stroke();
	}
}

function updateBoard() {
	updateCanvas();
	for (let r = 0; r < board.rows; r++) {
		for (let c = 0; c < board.cols; c++) {
			if (board.cells[r][c]) {
				ctx.fillStyle = "#00FF00";
			} else {
				ctx.fillStyle = "#FF0000";
			}
			ctx.fillRect(c*cellSize, r*cellSize, cellSize - 3, cellSize - 3);
			ctx.fillStyle = "#000000";
			ctx.fillText(board.getCellIndex(r,c), c*cellSize+5, r*cellSize+13)
			if (board.contents[r][c] != null) {
				// TODO get color
				const color = board.contents[r][c].player == "Blue" ? "#0088FF" : "#FF0000";
				ctx.save();
				ctx.font= `${cellSize-13}px Arial`;
				ctx.fillStyle = color;
				ctx.textAlign = "center";
				ctx.fillText(board.contents[r][c].displayName, (c+0.5)*cellSize, (r+1)*cellSize-6);
				ctx.restore();
			}
		}
	}
	drawGridLines();
}

function updatePiece(index) {
	const piece = pieceTypes[index - 1];
	piece.moveVectors = document.getElementById("move" + index).value;
	piece.captureVectors = document.getElementById("capture" + index).value;
	piece.moveCaptureVectors = document.getElementById("moveCapture" + index).value;
	piece.identifier = document.getElementById("symbol" + index).value;
	piece.displayName = document.getElementById("display" + index).value;
	piece.royal = document.getElementById("royal" + index).checked;
	document.getElementById("label" + index).innerText = piece.identifier;
	updateBoard();
}

function setBCActionMode(i) {
	document.getElementById("mode" + mode).style.display = "none";
	mode = i;
	document.getElementById("mode" + i).style.display = "block";
}

function addPieceType() {
	// add new "new" radio button
	const radioButtonHolder = document.getElementById("modes");
	const newModeIndex = radioButtonHolder.children.length / 2;
	radioButtonHolder.innerHTML = radioButtonHolder.innerHTML + 
		`<input id="modeRadio${newModeIndex}" type="radio" value="${newModeIndex}" name="mode" onclick="setBCActionMode(${newModeIndex});"/>` + 
		`<label id="label${newModeIndex}" for="modeRadio${newModeIndex}">new</label>`;
	// add div for editing it
	const editingDiv = document.getElementById("modeDetails");
	editingDiv.innerHTML = editingDiv.innerHTML +
		`<div id="mode${newModeIndex}" style="display: none">` +
		`Symbol: <input id="symbol${newModeIndex}" type="text" value="" onchange="updatePiece(${newModeIndex});"/><br />` +
		`Display As: <input id="display${newModeIndex}" type="text" value="" onchange="updatePiece(${newModeIndex});"/><br />` +
		`Move: <input id="move${newModeIndex}" type="text" value="" onchange="updatePiece(${newModeIndex});"/><br />` +
		`Capture: <input id="capture${newModeIndex}" type="text" value="" onchange="updatePiece(${newModeIndex});"/><br />` +
		`MoveCapture: <input id="moveCapture${newModeIndex}" type="text" value="" onchange="updatePiece(${newModeIndex});"/><br />` +
		`Royal: <input type="checkbox" id="royal${newModeIndex}" onchange="updatePiece(${newModeIndex});" /><br />` +
		`</div>`;
	pieceTypes[newModeIndex - 1] = new MockPiece();
	return false;
}

document.getElementById("canvas").addEventListener("click", function(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const c = Math.floor(x / cellSize);
	const r = Math.floor(y / cellSize);
	if (mode === 0 && board.contents[r][c] == null) {
		board.cells[r][c] = !board.cells[r][c];
	} else if (mode === 0) {
		// TODO: Display where it can move / capture
	} else if (mode > 0) {
		if (board.contents[r][c] != null && board.contents[r][c].piece == pieceTypes[mode - 1].identifier) {
			// Remove
			board.contents[r][c] = null;
		} else {
			// Add
			board.contents[r][c] = pieceTypes[mode - 1];
			board.contents[r][c] = {
				piece: pieceTypes[mode - 1].identifier,
				displayName: pieceTypes[mode - 1].displayName,
				player: player === 0 ? "Blue" : "Red",
				location: board.getCellIndex(r, c)
			}
		}
	}
	updateBoard();
});

function getById(id) {
	const element = document.getElementById(id);
	return element;
}

function addChessPieceSubroutine(i, symbol, display, move, capture, movecapture, royal) {
	getById(`symbol${i}`).value = symbol;
	getById(`display${i}`).value = display;
	getById(`move${i}`).value = move;
	getById(`capture${i}`).value = capture;
	getById(`moveCapture${i}`).value = movecapture;
	getById(`royal${i}`).checked = royal;
	updatePiece(i);
}

function addChessPieces() {
	for (let i = 0; i < 11; i++) {
		addPieceType();
	}

	setTimeout(() => {
		let currentIndex = 0;
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"K", "K", "(0, 1);(1, 0);(1, 1)", "", "(0, 1);(1, 0);(1, 1)", true);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"Q", "Q", "(0, 1)+;(1, 0)+;(1, 1)+", "", "(0, 1)+;(1, 0)+;(1, 1)+", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"B", "B", "(1, 1)+", "", "(1, 1)+", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"R", "R", "(1, 0)+;(0, 1)+", "", "(1, 0)+;(0, 1)+", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"N", "N", "(1, 2)j;(2, 1)j", "", "(1, 2)j;(2, 1)j", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"C", "C", "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)", "", "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"W", "W", "(3, 1)j; (1, 3)j; (1, 1)", "", "(3, 1)j; (1, 3)j; (1, 1)", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"pU", "p", "(0, -1d); (0, -1{3}di)", "", "(1, -1d)", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"pD", "p", "(0, 1d); (0, 1{3}di)", "", "(1, 1d)", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"pL", "p", "(-1d, 0); (-1{3}di, 0)", "", "(-1d, 1)", false);
	
		currentIndex++;
		addChessPieceSubroutine(currentIndex, 
			"pR", "p", "(1d, 0); (1{3}di, 0)", "", "(1d, 1)", false);
	}, 50);
}

function synthesizeConfig(mockBoard, mockPieces, p2IsCpu) {
    return `{
        "board": {
            "lengths": [${mockBoard.rows}, ${mockBoard.cols}],
            "adjacencyMatrix": null,
            "oob": [${mockBoard.getFalseCells().join(",")}],
            "wrapping": [${document.getElementById("wrapVertical").checked}, ${document.getElementById("wrapHorizontal").checked}]
        },
        "pieces": [
            ${ mockPieces.map(piece => {
                return `{ "move": "${piece.moveVectors}",` +
                    ` "capture": "${piece.captureVectors}",` + 
                    ` "moveCapture": "${piece.moveCaptureVectors}",` + 
                    ` "identifier": "${piece.identifier}",` +
                    ` "displayAs": "${piece.displayName}"}`;
            }).join(",") }
        ],
        "players": [{
            "identifier": "Blue",
            "color": "#0088FF",
            "direction": [1, 1],
            "dropablePieces": "",
            "capturedPieces": ""
        },
        {
            "identifier": "Red",
            "color": "#FF0000",
            "direction": [1, 1],
            "dropablePieces": "",
            "capturedPieces": "",
            "isCPU": ${p2IsCpu}
        }],
        "endConditions": [
            ${ mockPieces.map(piece => {
                if (!piece.royal) {
                    return "";
                }
                return `{ "player": "Red", "win": false, ` + 
                    `"config": "check ${piece.identifier} end Blue"},` + 
                    `{"player": "Blue", "win": false, "config": "check ${piece.identifier} @ end Red"}`
            }).filter(x => x.length > 0).join(", ") }
        ],
        "boardState": [
            ${ board.contents.map(row => {
                return row.filter(x => x != null).map(item => {
                    return `{"player": "${item.player}", "piece": "${item.piece}", "location": ${item.location}}`;
                }).join(", ");
            }).filter(x => x.length > 0).join(", ") }
        ]
    }`;
}

function launchCustomGame() {
	const configJson = JSON.parse(synthesizeConfig(board, pieceTypes, p2IsCpu));
	loadCustomConfig(configJson);
}