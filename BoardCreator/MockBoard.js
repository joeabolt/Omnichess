class MockBoard  {
	constructor(rows, cols) {
		this.makeNewBoard(rows, cols);
		this.wrapHorizontal = false;
        this.wrapVertical = false;
	}
	
	setRows(nrows) {
		this.makeNewBoard(nrows, this.cols);
	}
	
	setCols(ncols) {
		this.makeNewBoard(this.rows, ncols);
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
	
	updateCellIndexList() {
		this.cellIndices = [];
		/* Starts at 1 so all values have a sign */
		let currIndex = 1;
		for (let r = 0; r < this.rows; r++) {
			this.cellIndices[r] = [];
			for (let c = 0; c < this.cols; c++) {
				this.cellIndices[r][c] = currIndex++;
				
				/* Invert invalid cells */
				if (!this.cells[r][c]) this.cellIndices[r][c] *= -1;
			}
		}
	}

	getCellIndex(row, column) {
		if (row === -1 || column === -1) {
			return null;
		}
		return this.cellIndices[row][column];
	}
	
	createAdjacencyMatrix() {
		this.updateCellIndexList();
		/* UL, U, UR, L, 0, R, DL, D, DR */
		const adjacencyMatrix = [];
		for (let i = 0; i < this.rows * this.cols; i++) {
			const row = Math.floor(i / this.cols);
			const col = i % this.cols;
			const cellIndex = Math.abs(this.cellIndices[row][col]) - 1;
			// if (cellIndex == -1)
				// continue;
			adjacencyMatrix[cellIndex] = [null, null, null, null, null, null, null, null, null];

			const rowAbove = row > 0 ? row - 1 : (this.wrapVertical ? this.rows - 1 : -1);
			const rowBelow = row < this.rows - 1 ? row + 1 : (this.wrapVertical ? 0 : -1);
			const leftCol = col > 0 ? col - 1 : (this.wrapHorizontal ? this.cols - 1 : -1);
			const rightCol = col < this.cols - 1 ? col + 1 : (this.wrapHorizontal ? 0 : -1);
			
			/* For each direction, checks if next cell is valid.
			 * If so, add the next cell's index. Otherwise, 0.
			 * 0 is up-left, 1 is up-center, and so on.
			 */
			adjacencyMatrix[cellIndex][0] = this.getCellIndex(rowAbove, leftCol);
			adjacencyMatrix[cellIndex][1] = this.getCellIndex(rowAbove, col);
			adjacencyMatrix[cellIndex][2] = this.getCellIndex(rowAbove, rightCol);
			adjacencyMatrix[cellIndex][3] = this.getCellIndex(row, leftCol);
			adjacencyMatrix[cellIndex][4] = this.getCellIndex(row, col);
			adjacencyMatrix[cellIndex][5] = this.getCellIndex(row, rightCol);
			adjacencyMatrix[cellIndex][6] = this.getCellIndex(rowBelow, leftCol);
			adjacencyMatrix[cellIndex][7] = this.getCellIndex(rowBelow, col);
			adjacencyMatrix[cellIndex][8] = this.getCellIndex(rowBelow, rightCol);
		}
		return adjacencyMatrix;
	}
	
	createAdjacencyMatrixString() {
		return "[" + 
			this.createAdjacencyMatrix()
			.map(row => JSON.stringify(row))
			.join(", ") + "]";
		// const adjMatrix = this.createAdjacencyMatrix();
		// let adjMatStr = "[";
		// for (let row = 0; row < adjMatrix.length; row++) {
		// 	adjMatStr += "[";
		// 	for (let col = 0; col < adjMatrix[row].length; col++) {
		// 		adjMatStr += (adjMatrix[row][col] !== null ? adjMatrix[row][col] : "null") + ",";
		// 	}
		// 	adjMatStr = adjMatStr.slice(0, -1) + "]";
		// }
		// adjMatStr += "]";
		// return adjMatStr;
	}
}