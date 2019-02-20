/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		this.moveQueue = [];
	}
	
	/**
	 * Method to be called by the front-end. Incurs computational
	 * cost each time called. Outputs the current state of the board.
	 */
	Realize()
	{
		let outputArea = document.getElementById("output");
		if (outputArea.firstChild)
		{
			outputArea.removeChild(outputArea.firstChild);
		}
		outputArea.appendChild(this.CreateDisplayBoard());
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
		let toDisplay = this.board.ConvertToArray();
		
		for (let r = 0; r < toDisplay.length; r++)
		{
			let row = board.insertRow(r);
			for (let c = 0; c < toDisplay[r].length; c++)
			{
				let cell = row.insertCell(c);
				
				let contents = "&nbsp";
				let backgroundColor = "#000000";
				let foregroundColor = "#FFFFFF";
				
				if (toDisplay[r][c] === -1)
				{
					contents = "&nbsp";
					backgroundColor = "#AAAAAA";
					foregroundColor = "#FFFFFF";
				}
				else
				{
					if (this.board.contents[toDisplay[r][c]] !== undefined)
					{
						contents = this.board.contents[toDisplay[r][c]].identifier;
					}
					
					backgroundColor = (r % 2 === 0) ^ (c % 2 === 0) ? "#000000" : "#FFFFFF";
					foregroundColor = (r % 2 === 0) ^ (c % 2 === 0) ? "#FFFFFF" : "#000000";
					if (this.board.contents[toDisplay[r][c]] !== undefined && this.board.contents[toDisplay[r][c]].player.color !== undefined)
					{
						foregroundColor = this.board.contents[toDisplay[r][c]].player.color;
					}
				}

				cell.style.backgroundColor = backgroundColor;
				cell.style.color = foregroundColor;
				cell.innerHTML = `${contents}`;
			}
		}
		
		return board;
	}
}