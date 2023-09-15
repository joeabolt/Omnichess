/* Initialize main variables */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "18px Arial";
let cellSize = 50;
let board = new MockBoard(8, 8);
let pieceTypes = [];
let player = 0;
let mode = 0; // 0 => Activate / Deactivate; >0 => toggle pieceTypes[mode - 1]
updateBoard();
updateOutput();

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

function updateWrapping() {
	board.wrapHorizontal = document.getElementById("wrapHorizontal").checked;
	board.wrapVertical = document.getElementById("wrapVertical").checked;
	updateBoard();
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
	board.updateCellIndexList();
	for (let r = 0; r < board.rows; r++) {
		for (let c = 0; c < board.cols; c++) {
			if (board.cells[r][c]) {
				ctx.fillStyle = "#00FF00";
			}
			else {
				ctx.fillStyle = "#FF0000";
			}
			ctx.fillRect(c*cellSize, r*cellSize, cellSize - 3, cellSize - 3);
			ctx.fillStyle = "#000000";
			ctx.fillText(board.cellIndices[r][c], c*cellSize+5, r*cellSize+13)
			if (board.contents[r][c] != null) {
				// TODO get color
				const color = board.contents[r][c].player == "Blue" ? "#0088FF" : "#FF0000";
				drawTextWithin(ctx, board.contents[r][c].displayName, c*cellSize, r*cellSize, cellSize, cellSize, 60, 0, color);
			}
		}
	}
	drawGridLines();
	updateOutput();
}

function updateOutput() {
	// document.getElementById("output").innerHTML = board.createAdjacencyMatrixString();
	document.getElementById("output").innerHTML = synthesizeConfig(board, pieceTypes);
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

function setMode(i) {
	document.getElementById("mode" + mode).style.display = "none";
	mode = i;
	document.getElementById("mode" + i).style.display = "block";
}

function addPieceType() {
	// add new "new" radio button
	const radioButtonHolder = document.getElementById("modes");
	const newModeIndex = radioButtonHolder.children.length / 2;
	radioButtonHolder.innerHTML = radioButtonHolder.innerHTML + 
		`<input id="modeRadio${newModeIndex}" type="radio" value="${newModeIndex}" name="mode" onclick="setMode(${newModeIndex});"/>` + 
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
	updateOutput();
});

function drawTextWithin(ctx, text, x, y, w, h, size, minFontSize, color) {
	ctx.save();

	for (let fontSize = size; fontSize >= minFontSize; fontSize--) {
		ctx.font= `${fontSize}px Arial`;
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		let words = text.split(" ");
		let lines = [words.shift()];
		while (words.length > 0) {
			const lastLine = lines[lines.length - 1];
			const testLine = lastLine + " " + words[0];
			const lineWidth = ctx.measureText(testLine).width;
			if (lineWidth < w) {
				lines[lines.length - 1] = lines[lines.length - 1] + " " + words.shift();
			} else {
				lines.push(words.shift());
			}
		}
		const lineMeasure = ctx.measureText(lines[0]);
		const lineHeight = lineMeasure.actualBoundingBoxAscent + lineMeasure.actualBoundingBoxDescent;

		// Check total height
		if (lineHeight * lines.length > h) {
			continue;
		}

		// Check row widths
		if (lines.some(line => ctx.measureText(line).width > w)) {
			continue;
		}

		// Draw lines
		const baseX = x + (w / 2);
		const baseY = y + ((h - (lineHeight*lines.length)) / 2)
		ctx.translate(baseX, baseY);
		lines.forEach((line, index) => {
			ctx.translate(0, lineHeight);
			ctx.fillText(line, 0, 0);
		});

		ctx.restore();
		return true;
	}

	ctx.restore();
	return false;
}

function getById(id) {
	const element = document.getElementById(id);
	return element;
}

function addChessPieces() {
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();
	addPieceType();

	setTimeout(() => {
		let currentIndex = 0;
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "K";
		getById(`display${currentIndex}`).value = "K";
		getById(`move${currentIndex}`).value = "(0, 1);(1, 0);(1, 1)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(0, 1);(1, 0);(1, 1)";
		getById(`royal${currentIndex}`).checked = true;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "Q";
		getById(`display${currentIndex}`).value = "Q";
		getById(`move${currentIndex}`).value = "(0, 1)+;(1, 0)+;(1, 1)+";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(0, 1)+;(1, 0)+;(1, 1)+";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "B";
		getById(`display${currentIndex}`).value = "B";
		getById(`move${currentIndex}`).value = "(1, 1)+";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1, 1)+";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "R";
		getById(`display${currentIndex}`).value = "R";
		getById(`move${currentIndex}`).value = "(1, 0)+;(0, 1)+";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1, 0)+;(0, 1)+";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "N";
		getById(`display${currentIndex}`).value = "N";
		getById(`move${currentIndex}`).value = "(1, 2)j;(2, 1)j";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1, 2)j;(2, 1)j";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "C";
		getById(`display${currentIndex}`).value = "C";
		getById(`move${currentIndex}`).value = "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(2, 2)j; (2, 0)j; (0, 2)j; (0, 1); (1, 0)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "W";
		getById(`display${currentIndex}`).value = "W";
		getById(`move${currentIndex}`).value = "(3, 1)j; (1, 3)j; (1, 1)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(3, 1)j; (1, 3)j; (1, 1)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "pU";
		getById(`display${currentIndex}`).value = "p";
		getById(`move${currentIndex}`).value = "(0, -1d); (0, -1{3}di)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1, -1d)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "pD";
		getById(`display${currentIndex}`).value = "p";
		getById(`move${currentIndex}`).value = "(0, 1d); (0, 1{3}di)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1, 1d)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "pL";
		getById(`display${currentIndex}`).value = "p";
		getById(`move${currentIndex}`).value = "(-1d, 0); (-1{3}di, 0)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(-1d, 1)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	
		currentIndex++;
		getById(`symbol${currentIndex}`).value = "pR";
		getById(`display${currentIndex}`).value = "p";
		getById(`move${currentIndex}`).value = "(1d, 0); (1{3}di, 0)";
		getById(`capture${currentIndex}`).value = "";
		getById(`moveCapture${currentIndex}`).value = "(1d, 1)";
		getById(`royal${currentIndex}`).checked = false;
		updatePiece(currentIndex);
	}, 50);
}