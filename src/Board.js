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