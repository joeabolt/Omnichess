class MockBoard 
{
	constructor(rows, cols)
	{
		this.makeNewBoard(rows, cols);
	}
	
	setRows(nrows)
	{
		this.makeNewBoard(nrows, this.cols);
	}
	
	setCols(ncols)
	{
		this.makeNewBoard(this.rows, ncols);
	}
	
	makeNewBoard(rows, cols)
	{
		this.rows = rows;
		this.cols = cols;
		this.cells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++)
		{
			this.cells[i] = new Array(this.cols).fill(true);
		}
	}
	
	updateCellIndexList()
	{
		this.cellIndices = [];
		/* Starts at 1 so 0 can be used as a flag value */
		let currIndex = 1;
		for (let r = 0; r < this.rows; r++)
		{
			this.cellIndices[r] = [];
			for (let c = 0; c < this.cols; c++)
			{
				this.cellIndices[r][c] = currIndex++;
				
				/* Invert out-of-bounds cells */
				if (!this.cells[r][c]) this.cellIndices[r][c] *= -1;
			}
		}
	}
	
	createAdjacencyMatrix()
	{
		this.updateCellIndexList();
		/* UL, U, UR, L, 0, R, DL, D, DR */
		const adjacencyMatrix = [];
		for (let i = 0; i < this.rows * this.cols; i++)
		{
			const row = Math.floor(i / this.cols);
			const col = i % this.cols;
			const cellIndex = Math.abs(this.cellIndices[row][col]) - 1;
			// if (cellIndex == -1)
				// continue;
			adjacencyMatrix[cellIndex] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			
			/* For each direction, checks if next cell is valid.
			 * If so, add the next cell's index. Otherwise, 0.
			 * 0 is up-left, 1 is up-center, and so on.
			 */
			adjacencyMatrix[cellIndex][0] = (row === 0 || col === 0) ? 0 : this.cellIndices[row-1][col-1];
			adjacencyMatrix[cellIndex][1] = (row === 0) ? 0 : this.cellIndices[row-1][col];
			adjacencyMatrix[cellIndex][2] = (row === 0 || col === this.cols - 1) ? 0 : this.cellIndices[row-1][col+1];
			adjacencyMatrix[cellIndex][3] = (col === 0) ? 0 : this.cellIndices[row][col-1];
			adjacencyMatrix[cellIndex][4] = this.cellIndices[row][col];
			adjacencyMatrix[cellIndex][5] = (col === this.cols - 1) ? 0 : this.cellIndices[row][col+1];
			adjacencyMatrix[cellIndex][6] = (row === this.rows - 1 || col === 0) ? 0 : this.cellIndices[row+1][col-1];
			adjacencyMatrix[cellIndex][7] = (row === this.rows - 1) ? 0 : this.cellIndices[row+1][col];
			adjacencyMatrix[cellIndex][8] = (row === this.rows - 1 || col === this.cols - 1) ? 0 : this.cellIndices[row+1][col+1];
		}
		return adjacencyMatrix;
	}
	
	createAdjacencyMatrixString()
	{
		const adjMatrix = this.createAdjacencyMatrix();
		let adjMatStr = "[";
		for (let i = 0; i < adjMatrix.length; i++)
		{
			adjMatStr += "[" + adjMatrix[i].toString() + "],";
		}
		adjMatStr = adjMatStr.slice(0, -1) + "]";
		return adjMatStr;
	}
}

/* Initialize main variables */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "18px Arial";
let cellSize = 50;
let board = new MockBoard(8, 8);
updateBoard();
updateOutput();

function updateBoardSize()
{
	const rows = parseInt(document.getElementById("rows").value);
	const cols = parseInt(document.getElementById("cols").value);
	board.setRows(rows);
	board.setCols(cols);
	updateBoard();
}

function updateCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	cellSize = parseInt(document.getElementById("gridwidth").value);
	const rows = parseInt(document.getElementById("rows").value);
	const cols = parseInt(document.getElementById("cols").value);
	canvas.width = cols * cellSize;
	canvas.height = rows * cellSize;
}

function drawGridLines(color)
{
	let ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#BBBBBB";
	for(let i = 0; i < canvas.width; i+=cellSize)
	{
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
		ctx.stroke();
	}
	for(let i = 0; i < canvas.height; i+=cellSize)
	{
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
		ctx.stroke();
	}
}

function updateBoard()
{
	updateCanvas();
	board.updateCellIndexList();
	for (let r = 0; r < board.rows; r++)
	{
		for (let c = 0; c < board.cols; c++)
		{
			if (board.cells[r][c])
			{
				ctx.fillStyle = "#00FF00";
			}
			else
			{
				ctx.fillStyle = "#FF0000";
			}
			ctx.fillRect(c*cellSize, r*cellSize, cellSize - 3, cellSize - 3);
			ctx.fillStyle = "#000000";
			ctx.fillText(board.cellIndices[r][c], c*cellSize+5, r*cellSize+13)
		}
	}
	drawGridLines();
}

function updateOutput()
{
	document.getElementById("output").innerHTML = board.createAdjacencyMatrixString();
}

document.getElementById("canvas").addEventListener("click", function(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	const c = Math.floor(x / cellSize);
	const r = Math.floor(y / cellSize);
	board.cells[r][c] = !board.cells[r][c];
	updateBoard();
	updateOutput();
});