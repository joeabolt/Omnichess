/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		this.moveQueue = [];
		
		this.cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
		
		this.displayBoard = this.CreateDisplayBoard();
	}
	
	/**
	 * Method to be called by the front-end. Incurs computational
	 * cost each time called. Outputs the current state of the board.
	 */
	Realize()
	{
		/* Update the board */
		this.displayBoard = this.CreateDisplayBoard();
		
		/* Display it */
		let outputArea = document.getElementById("output");
		if (outputArea.firstChild)
		{
			outputArea.removeChild(outputArea.firstChild);
		}
		outputArea.appendChild(this.displayBoard);
		this.isFullyUpdated = true;
	}
	
	InputMove(move)
	{
		/* Parse move into object */
		const moveObject = {};
		moveObject.move = move.includes("->");
		moveObject.capture = move.includes("x");
		moveObject.source = Number(move.match(/^\d+/));
		moveObject.target = Number(move.trim().match(/\d+$/));
		
		/* Load move */
		this.moveQueue.push(moveObject);
		
		/* Fire up the game engine */
		this.game.Step(moveObject);
	}
	
	CreateDisplayBoard()
	{
		let board = document.createElement("table");
		for (let rowIndex = 0; rowIndex < this.cellsPerRow; rowIndex++)
		{
			let row = board.insertRow(rowIndex);
			for (let col = 0; col < this.cellsPerRow; col++)
			{
				let cell = row.insertCell(col);
				const index = rowIndex * this.cellsPerRow + col;
				
				/* Obtain the contents of this cell, as a string */
				let contents = this.board.contents[index];
				contents = contents === undefined ? "&nbsp" : contents.identifier;
				
				const backgroundColor = (rowIndex % 2 === 0) ^ (col % 2 === 0) ? "#000000" : "#FFFFFF";
				let foregroundColor = (rowIndex % 2 === 0) ^ (col % 2 === 0) ? "#FFFFFF" : "#000000";
				if (this.board.contents[index] !== undefined && this.board.contents[index].player.color !== undefined)
				{
					foregroundColor = this.board.contents[index].player.color;
				}
				
				cell.style.backgroundColor = backgroundColor;
				cell.style.color = foregroundColor;
				cell.innerHTML = `${index}<br />${contents}`;
			}
		}
		
		return board;
	}
}