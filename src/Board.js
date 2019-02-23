/* Represents the board state at a point in time */
class Board 
{
	constructor(adjacencyMatrix)
	{
		this.cells = adjacencyMatrix;
		/* The below works because we insist on a square/cubic grid */
		this.dimensions = Math.round(Math.log(adjacencyMatrix[0].length) / Math.log(3));
		this.contents = [];
		for (let i = 0; i < this.cells.length; i++)
		{
			this.contents.push(undefined);
		}
	}
	
	/**
	 *  Returns a Set of all locations (as indices) described
	 *  by the vector relative to startLocation. Does not account
	 *  for a blocked destination, since this could be used for
	 *  capture, but it will not continue down a blocked path.
	 *  
	 *  Always returns an array. Returns an empty array if no such
	 *  locations can be found. 
	 */
	GetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false)
	{
		const allCellIndices = new Set();
		
		const x = vector.components[0];
		const y = vector.components[1];
		
		for (let i = 1; i <= Math.max(x.maxRep, y.maxRep); i++)
		{
			const dx = x.length * Math.min(i, x.maxRep);
			const dy = y.length * Math.min(i, y.maxRep);
			const output = this.GetPathOutput(startLocation, dx, dy, x.hop, y.hop, x.jump, y.jump);

			if (output === -1 || 
				(this.contents[output] !== undefined && !includeCaptureEligible) || 
				(this.contents[output] === undefined && enforceCaptureEligible))
			{
				continue;
			}
			if (this.contents[output] !== undefined && enforceCaptureEligible)
			{
				allCellIndices.add(output);
				continue;
			}
			allCellIndices.add(output);
		}
		
		/* Convert set to array */
		return [...allCellIndices];
	}
	
	/**
	 *  Returns the index of the cell dx and dy units
	 *  away from start. Returns -1 if no such 
	 *  destination exists. 
	 */
	GetPathOutput(start, dx, dy, xHop, yHop, xJump, yJump)
	{
		let destination = start;
		let previous = start;
		let stepX = 0;
		let stepY = 0;
			
		while (dx !== 0 || dy !== 0)
		{
			stepX = Math.sign(dx);
			stepY = Math.sign(dy);
			dx -= Math.sign(dx);
			dy -= Math.sign(dy);
			
			/*
			 * Add 1 because arrays cannot have negative indices
			 * Use powers of 3 because there are always three options in a direction
			 * (e.g., top-left, top-center, top-right).
			 */
			// TODO: Adapt this for N-dimensional boards, eventually
			const direction = (stepY+1) * Math.pow(3, this.dimensions - 1) 
				+ (stepX+1) * Math.pow(3, this.dimensions - 2);
			previous = destination;
			destination = this.cells[destination][direction];
			if (destination === -1)
			{
				break;
			}
			
			/* Stop iterating when we hit an occupied square, unless jump or hop */
			const stepJump = (xJump && stepX !== 0) || (yJump && stepY !== 0);
			const stepHop = (xHop && stepX !== 0) || (yHop && stepY !== 0);
			
			if ((dx !== 0 || dy !== 0) && this.contents[destination] !== undefined)
			{
				if (stepJump || stepHop) continue;
				return -1;
			}
		}
		
		/* If hop, only output when the previous is occupied */
		if (((xHop && stepX !== 0) || (yHop && stepY !== 0)) && this.contents[previous] === undefined)
		{
			return -1;
		}
		
		return destination;
	}
	
	/**
	 * Produces a two-dimensional array. Each cell represents a visible slot on the board.
	 * Where these cells are not included in the board, they contain -1. Otherwise, they
	 * contain the index of the cell they represent.
	 */
	ConvertToArray()
	{
		if (this.cells.length === 0)
		{
			return [[]];
		}

		let outputBoard = [];
		
		/* Create space for first cell, from which to create the rest of the board */
		this.InsertRowInMatrix(outputBoard, 0);
		this.InsertColumnInMatrix(outputBoard, 0);
		
		/* Use the center direction to correctly get sign of first cell */
		outputBoard[0][0] = this.cells[0][(Math.pow(3, this.dimensions) + 1) / 2];
		
		let cellsToAdd = this.Expand(outputBoard[0][0], outputBoard, 0, 0);
		while (cellsToAdd.length > 0)
		{
			const index = cellsToAdd.shift();
			const coords = this.GetRowAndColumn(index, outputBoard);
			cellsToAdd = cellsToAdd.concat(this.Expand(Math.abs(index), outputBoard, coords[0], coords[1]));
		}

		return outputBoard;
	}
	
	Expand(index, matrix, r, c)
	{
		const neighbors = this.cells[index];
		const cellsAdded = []
		for (let direction = 0; direction < neighbors.length; direction++)
		{
			if (neighbors[direction] === 0) /* Flag value for out of bounds */
				continue;
				
			/* Skip over cells we have already inserted */
			if (this.GetRowAndColumn(neighbors[direction], matrix) !== undefined)
				continue;
			
			/* Pad the top, bottom, left, and right */
			// TODO: Update for n-dimensionality
			if (direction < 3 && r === 0)
			{
				this.InsertRowInMatrix(matrix, 0);
				r = 1;
			}
			if (direction >= 6 && r === matrix.length - 1)
			{
				this.InsertRowInMatrix(matrix, matrix.length);
			}
			if (direction % 3 === 0 && c === 0)
			{
				this.InsertColumnInMatrix(matrix, 0);
				c = 1;
			}
			if (direction % 3 === 2 && c === matrix[0].length - 1)
			{
				this.InsertColumnInMatrix(matrix, matrix[0].length);
			}
			
			// Insert neighbor
			let newR = r;
			if (direction < 3) newR--;
			if (direction >= 6) newR++;
			let newC = c;
			if (direction % 3 === 0) newC--;
			if (direction % 3 === 2) newC++;
			
			matrix[newR][newC] = neighbors[direction];
			cellsAdded.push(neighbors[direction]);
			console.log("Inserting " + neighbors[direction] + " in direction " + direction + " from r" + r + " c" + c);
			console.log(this.MatrixToString(matrix));
		}
		
		return cellsAdded;
	}
	
	GetRowAndColumn(index, matrix)
	{
		for (let r = 0; r < matrix.length; r++)
		{
			if (matrix[r].includes(index))
			{
				return [r, matrix[r].indexOf(index)];
			}
		}
		return undefined;
	}
	
	/**
	 * Inserts a new row in the matrix before the specified index.
	 * If rIndex is 0, adds a row to the top. If rIndex is matrix.length,
	 * adds a row to the bottom.
	 */
	InsertRowInMatrix(matrix, rIndex, fillValue = -1)
	{
		matrix.splice(rIndex, 0, []);
		for (let i = 0; i < matrix[0].length; i++)
		{
			matrix[rIndex].push(fillValue);
		}
	}
	
	/**
	 * Inserts a new column in the matrix before the specified index.
	 * If cIndex is 0, adds a column to the left. If cIndex is
	 * matrix[0].length, adds a row to the bottom.
	 */
	InsertColumnInMatrix(matrix, cIndex, fillValue = -1)
	{
		for (let i = 0; i < matrix.length; i++)
		{
			matrix[i].splice(cIndex, 0, fillValue);
		}
	}
	
	/**
	 * Convenience method for debugging. Outputs a matrix in a
	 * human-readable format. 
	 */
	MatrixToString(matrix)
	{
		let output = "[";
		for (let r = 0; r < matrix.length; r++)
		{
			output += (r > 0 ? " " : "") + "[";
			for (let c = 0; c < matrix[r].length; c++)
			{
				output += matrix[r][c] + ", ";
			}
			output = output.slice(0, -2) + "]\n";
		}
		output = output.slice(0, -1) + "]";
		return output;
	}
	
	/**
	 *  Generates and returns a new 2D Board with the specified
	 *  number of rows and columns. Uses a square grid and the
	 *  usual 2 axes.
	 */
	static Generate2D(rows, cols)
	{
		/* UL, U, UR, L, 0, R, DL, D, DR */
		const adjacencyMatrix = [];
		for (let i = 1; i <= rows * cols; i++)
		{
			const matrixIndex = i - 1;
			adjacencyMatrix[matrixIndex] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			
			/* For each direction, checks if next cell is valid.
			 * If so, add the next cell's index. Otherwise, -1.
			 * 0 is up-left, 1 is up-center, and so on.
			 */
			const upInvalid = i < cols;
			const downInvalid = (i + cols) > (rows * cols);
			const leftInvalid = i % cols === 1;
			const rightInvalid = i % cols === 0;
			adjacencyMatrix[matrixIndex][0] = (upInvalid || leftInvalid) ? 0 : i-cols-1;
			adjacencyMatrix[matrixIndex][1] = (upInvalid) ? 0 : i-cols;
			adjacencyMatrix[matrixIndex][2] = (upInvalid || rightInvalid) ? 0 : i-cols+1;
			adjacencyMatrix[matrixIndex][3] = (leftInvalid) ? 0 : i-1;
			adjacencyMatrix[matrixIndex][4] = i;
			adjacencyMatrix[matrixIndex][5] = (rightInvalid) ? 0 : i+1;
			adjacencyMatrix[matrixIndex][6] = (downInvalid || leftInvalid) ? 0 : i+cols-1;
			adjacencyMatrix[matrixIndex][7] = (downInvalid) ? 0 : i+cols;
			adjacencyMatrix[matrixIndex][8] = (downInvalid || rightInvalid) ? 0 : i+cols+1;
		}
		return adjacencyMatrix;
	}
}
