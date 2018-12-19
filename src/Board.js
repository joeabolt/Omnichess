/* Represents the board state at a point in time */
class Board 
{
	constructor(adjacencyMatrix)
	{
		this.cells = adjacencyMatrix;
		/* The below works because we insist on a square/cubic grid */
		this.dimensions = Math.log(adjacencyMatrix[0].length) / Math.log(3);
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
	 *  Always returns a Set. Returns an empty Set if no such
	 *  locations can be found. 
	 */
	GetCellIndices(vector, startLocation)
	{
		const allCellIndices = new Set();
		
		const x = vector.components[0];
		const y = vector.components[1];
		
		let dx = 0;
		let dy = 0;
		for (let i = 0; i < x.maxRep; i++)
		{
			dx += x.length;
			for (let j = 0; j < y.maxRep; j++)
			{
				dy += y.length;
				const output = this.GetPathOutput(startLocation, dx, dy, x.hop, y.hop, x.jump, y.jump);
				
				// TODO: Update second clause so this function works for capture and for movement
				if (output === -1 || this.contents[output] !== undefined)
					continue;
				allCellIndices.add(output);
			}
		}
		
		return allCellIndices;
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
			
			/* Add 1 because arrays cannot have negative indices */
			const direction = (stepY+1) * this.dimensions + (stepX+1);
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
	 *  Creates a Board object based on the passed in JSON object.
	 *  Expects boardObj to have a sting called dimensions of the form
	 *  "AxB" for A rows and B columns. 
	 *
	 *  In the future, this will take take the form "AxBx...xZ".
	 */
	static Create(boardObj)
	{
		/* expects boardObj to have a string dimensions "AxB" */
		const lengths = boardObj.dimensions.split("x");
		return new Board(Board.Generate2D(Number(lengths[0]), Number(lengths[1])));
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
		for (let i = 0; i < rows * cols; i++)
		{
			adjacencyMatrix[i] = [i-cols-1, i-cols, i-cols+1, 
				i-1, i, i+1, 
				i+cols-1, i+cols, i+cols+1];
				
			/* Removes above if at top of board */
			if (i < cols)
			{
				adjacencyMatrix[i][0] = -1;
				adjacencyMatrix[i][1] = -1;
				adjacencyMatrix[i][2] = -1;
			}
			/* Removes to the left if at left of board */
			if (i % cols === 0)
			{
				adjacencyMatrix[i][0] = -1;
				adjacencyMatrix[i][3] = -1;
				adjacencyMatrix[i][6] = -1;
			}
			/* Removes to the right if at right of board */
			if (i % cols === (cols - 1))
			{
				adjacencyMatrix[i][2] = -1;
				adjacencyMatrix[i][5] = -1;
				adjacencyMatrix[i][8] = -1;
			}
			/* Removes below if at bottom of board */
			if ((i + cols) >= (rows * cols))
			{
				adjacencyMatrix[i][6] = -1;
				adjacencyMatrix[i][7] = -1;
				adjacencyMatrix[i][8] = -1;
			}
		}
		return adjacencyMatrix;
	}
}
