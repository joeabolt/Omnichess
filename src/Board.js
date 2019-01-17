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
	 *  Always returns a Set. Returns an empty Set if no such
	 *  locations can be found. 
	 */
	GetCellIndices(vector, startLocation, includeCaptureEligible = false)
	{
		const allCellIndices = new Set();
		
		const x = vector.components[0];
		const y = vector.components[1];
		
		for (let i = 1; i <= Math.max(x.maxRep, y.maxRep); i++)
		{
			const dx = x.length * Math.min(i, x.maxRep);
			const dy = y.length * Math.min(i, y.maxRep);
			const output = this.GetPathOutput(startLocation, dx, dy, x.hop, y.hop, x.jump, y.jump);
			
			if (output === -1 || (this.contents[output] !== undefined && !includeCaptureEligible))
				continue;
			allCellIndices.add(output);
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
			adjacencyMatrix[i] = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
			
			/* Assign cells if valid */
			adjacencyMatrix[i][0] = (i < cols || i % cols === 0) ? -1 : i-cols-1;
			adjacencyMatrix[i][1] = (i < cols) ? -1 : i-cols;
			adjacencyMatrix[i][2] = (i < cols || i % cols === (cols - 1)) ? -1 : i-cols+1;
			adjacencyMatrix[i][3] = (i % cols === 0) ? -1 : i-1;
			adjacencyMatrix[i][4] = i;
			adjacencyMatrix[i][5] = (i % cols === (cols - 1)) ? -1 : i+1;
			adjacencyMatrix[i][6] = ((i + cols) >= (rows * cols) || i % cols === 0) ? -1 : i+cols-1;
			adjacencyMatrix[i][7] = ((i + cols) >= (rows * cols)) ? -1 : i+cols;
			adjacencyMatrix[i][8] = ((i + cols) >= (rows * cols) || i % cols === (cols - 1)) ? -1 : i+cols+1;
		}
		return adjacencyMatrix;
	}
}
