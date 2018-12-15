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
				var output = this.GetPathOutput(startLocation, dx, dy);
				if (output == -1)
					continue;
				toReturn.add(output);
			}
		}
		
		return toReturn;
	}
	
	/**
	 *  Returns the index of the cell dx and dy units
	 *  away from start. Returns -1 if the path is 
	 *  obstructed, or if no such destination exists.
	 *
	 * Does not account for hop, jump.
	 */
	GetPathOutput(start, dx, dy)
	{
		var destination = start;
		while (dx != 0 || dy != 0)
		{
			var direction = 4; // the "no movement" direction
			if (dx < 0)
			{
				direction--;
				dx++;
			}
			if (dx > 0)
			{
				direction++;
				dx--;
			}
			if (dy < 0)
			{
				direction += 3;
				dy++;
			}
			if (dy > 0)
			{
				direction -= 3;
				dy--;
			}
			
			destination = this.cells[destination][direction];
			if (destination == -1 || this.contents[destination] != undefined)
				break;
		}
		
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