/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		this.moveQueue = [];
		
		this.activeCell = undefined;
		this.activeCellCanMove = [];
		this.activeCellCanCapture = [];
		
		this.cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
	}
	
	SetActiveCell(newActiveCell)
	{
		this.activeCell = newActiveCell;
		this.activeCellCanMove = [];
		this.activeCellCanCapture = [];
		
		if (this.activeCell !== undefined && this.board.contents[this.activeCell] !== undefined)
		{
			const activePiece = this.board.contents[this.activeCell];
			
			activePiece.moveVectors.forEach((vector) => {
				this.activeCellCanMove = this.activeCellCanMove.concat(this.board.GetCellIndices(vector, this.activeCell, false));
			});
			this.activeCellCanMove = [...new Set(this.activeCellCanMove)];
			
			activePiece.captureVectors.forEach((vector) => {
				this.activeCellCanCapture = this.activeCellCanCapture.concat(this.board.GetCellIndices(vector, this.activeCell, true, true));
			});
			activePiece.moveCaptureVectors.forEach((vector) => {
				this.activeCellCanCapture = this.activeCellCanCapture.concat(this.board.GetCellIndices(vector, this.activeCell, true, true));
			});
			this.activeCellCanCapture = [...new Set(this.activeCellCanCapture)];
		}
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
		
		this.Realize();
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
				
				const backgroundColor = this.DetermineBackgroundColor(index, rowIndex, col);
				const foregroundColor = this.DetermineForegroundColor(index, rowIndex, col);
				
				cell.style.backgroundColor = backgroundColor;
				cell.style.color = foregroundColor;
				
				const size = "35px"; //TODO: Make this dynamic #55
				cell.style.width = size;
				cell.style.height = size;
				
				cell.onclick = () => { setActiveCell(event, index); };
				
				cell.innerHTML = `${index}<br />${contents}`;
			}
		}
		
		return board;
	}
	
	DetermineBackgroundColor(index, row, column)
	{
		let bgColor = (row % 2 === 0) ^ (column % 2 === 0) ? "#000000" : "#FFFFFF";
		
		if (this.activeCell !== undefined)
		{
			if (this.activeCell === index)
			{
				bgColor = "#00FF00";
			}
			if (this.activeCellCanMove.includes(index))
			{
				bgColor = "#0000FF";
			}
			if (this.activeCellCanCapture.includes(index))
			{
				bgColor = "#FF0000";
			}
		}
		
		return bgColor;
	}
	
	DetermineForegroundColor(index, row, column)
	{
		let fgColor = (row % 2 === 0) ^ (column % 2 === 0) ? "#FFFFFF" : "#000000";
		if (this.board.contents[index] !== undefined && this.board.contents[index].player.color !== undefined)
		{
			fgColor = this.board.contents[index].player.color;
		}

		if (this.activeCell !== undefined)
		{
			if (this.activeCell === index)
			{
				fgColor = "#000000";
			}
			if (this.activeCellCanMove.includes(index))
			{
				fgColor = "#FFFFFF";
			}
			if (this.activeCellCanCapture.includes(index))
			{
				fgColor = "#000000";
			}
		}
		
		return fgColor;
	}
}