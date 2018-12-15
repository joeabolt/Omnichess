/* Represents the board state at a point in time */
class Board 
{
	constructor(adjacencyMatrix)
	{
		this.cells = adjacencyMatrix;
		this.contents = [];
		for (var i = 0; i < this.cells.length; i++)
		{
			this.contents.push(undefined);
		}
	}
	
	GetCellIndices(vector, startLocation)
	{
		var toReturn = new Set();
		
		var x = vector.components[0];
		var y = vector.components[1];
		
		var dx = 0;
		var dy = 0;
		for (var i = 0; i < x.maxRep; i++)
		{
			dx += x.length;
			for (var j = 0; j < y.maxRep; j++)
			{
				dy += y.length;
				var output = this.GetPathOutput(startLocation, dx, dy, x.hop, y.hop, x.jump, y.jump);
				// TODO: Update second clause so this function works for capture and for movement
				if (output == -1 || this.contents[output] != undefined)
					continue;
				toReturn.add(output);
			}
		}
		
		return toReturn;
	}
	
	/**
	 *  Returns the index of the cell dx and dy units
	 *  away from start. Returns -1 if no such 
	 *  destination exists. 
	 */
	GetPathOutput(start, dx, dy, xHop, yHop, xJump, yJump)
	{
		var destination = start;
		var previous = start;
		var stepX = 0;
		var stepY = 0;
			
		while (dx != 0 || dy != 0)
		{
			stepX = 0;
			stepY = 0;
			if (dx < 0)
			{
				stepX = -1;
				dx++;
			}
			if (dx > 0)
			{
				var stepX = 1;
				dx--;
			}
			if (dy < 0)
			{
				var stepY = 1;
				dy++;
			}
			if (dy > 0)
			{
				var stepY = -1;
				dy--;
			}
			
			/* Add 1 because arrays cannot have negative indices */
			var direction = (stepY+1) * 3 + (stepX+1);
			previous = destination;
			destination = this.cells[destination][direction];
			if (destination == -1)
				break;		
			
			/* Stop iterating when we hit an occupied square, unless jump or hop */
			var stepJump = (xJump && stepX != 0) || (yJump && stepY != 0);
			var stepHop = (xHop && stepX != 0) || (yHop && stepY != 0);
			if ((dx != 0 || dy != 0) && this.contents[destination] != undefined)
			{
				if (stepJump || stepHop) continue;
				return -1;
			}
		}
		
		/* If hop, only output when the previous is occupied */
		if (((xHop && stepX != 0) || (yHop && stepY != 0)) && this.contents[previous] == undefined)
			return -1;
		
		return destination;
	}
	
	static Create(boardObj)
	{
		/* expects boardObj to have a string dimensions "AxB" */
		var lengths = boardObj.dimensions.split("x");
		return new Board(Board.Generate2D(Number(lengths[0]), Number(lengths[1])));
	}
	
	static Generate2D(rows, cols)
	{
		/* UL, U, UR, L, 0, R, DL, D, DR */
		var toReturn = [];
		for (var i = 0; i < rows * cols; i++)
		{
			toReturn[i] = [i-cols-1, i-cols, i-cols+1, 
				i-1, i, i+1, 
				i+cols-1, i+cols, i+cols+1];
				
			if (i < cols)
			{
				toReturn[i][0] = -1;
				toReturn[i][1] = -1;
				toReturn[i][2] = -1;
			}
			if (i % cols == 0)
			{
				toReturn[i][0] = -1;
				toReturn[i][3] = -1;
				toReturn[i][6] = -1;
			}
			if (i % cols == (cols - 1))
			{
				toReturn[i][2] = -1;
				toReturn[i][5] = -1;
				toReturn[i][8] = -1;
			}
			if ((i + cols) >= (rows * cols))
			{
				toReturn[i][6] = -1;
				toReturn[i][7] = -1;
				toReturn[i][8] = -1;
			}
		}
		return toReturn;
	}
}