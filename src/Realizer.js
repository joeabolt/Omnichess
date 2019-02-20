/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		this.moveQueue = [];
		
		this.activeCell = -1;
		this.activeCellCanMove = [];
		this.activeCellCanCapture = [];
		this.activeCellCanMoveCapture = [];
		
		this.cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
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
	
	ProcessClick(clickedCell)
	{
		if (this.activeCell == -1)
		{
			this.SetActiveCell(clickedCell);
			return;
		}
		if (this.activeCellCanMoveCapture.includes(clickedCell))
		{
			this.CreateAndProcessMove(true, true, this.activeCell, clickedCell);
			return;
		}
		if (this.activeCellCanCapture.includes(clickedCell))
		{
			this.CreateAndProcessMove(false, true, this.activeCell, clickedCell);
			return;
		}
		if (this.activeCellCanMove.includes(clickedCell))
		{
			this.CreateAndProcessMove(true, false, this.activeCell, clickedCell);
			return;
		}
		
		/* They just clicked another cell, not a viable action */
		SetActiveCell(clickedCell);
	}
	
	SetActiveCell(newActiveCell)
	{
		this.activeCell = newActiveCell;
		this.activeCellCanMove = [];
		this.activeCellCanCapture = [];
		this.activeCellCanMoveCapture = [];
		
		if (this.activeCell > 0 && this.board.contents[this.activeCell] !== undefined)
		{
			const activePiece = this.board.contents[this.activeCell];
			
			activePiece.moveVectors.forEach((vector) => {
				this.activeCellCanMove = this.activeCellCanMove.concat(this.board.GetCellIndices(vector, this.activeCell, false));
			});
			this.activeCellCanMove = [...new Set(this.activeCellCanMove)];
			
			activePiece.captureVectors.forEach((vector) => {
				this.activeCellCanCapture = this.activeCellCanCapture.concat(this.board.GetCellIndices(vector, this.activeCell, true, true));
			});
			this.activeCellCanCapture = [...new Set(this.activeCellCanCapture)];

			activePiece.moveCaptureVectors.forEach((vector) => {
				this.activeCellCanMoveCapture = this.activeCellCanMoveCapture.concat(this.board.GetCellIndices(vector, this.activeCell, true, true));
			});
			this.activeCellCanMoveCapture = [...new Set(this.activeCellCanMoveCapture)];
		}
	}
	
	CreateAndProcessMove(move, capture, source, target)
	{
		const moveObject = {};
		moveObject.move = move;
		moveObject.capture = capture;
		moveObject.source = source;
		moveObject.target = target;

		this.moveQueue.push(moveObject);
		this.game.Step(moveObject);
		this.activeCell = -1;
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
				
				cell.onclick = () => { processClick(event, index); };
				
				cell.innerHTML = `${index}<br />${contents}`;
			}
		}
		
		return board;
	}
	
	DetermineBackgroundColor(index, row, column)
	{
		let bgColor = (row % 2 === 0) ^ (column % 2 === 0) ? "#000000" : "#FFFFFF";
		
		if (this.activeCell >= 0)
		{
			if (this.activeCell === index)
			{
				bgColor = "#00FF00";
			}
			if (this.activeCellCanMove.includes(index))
			{
				bgColor = "#0000FF";
			}
			if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index))
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

		if (this.activeCell >= 0)
		{
			if (this.activeCell === index)
			{
				fgColor = "#000000";
			}
			if (this.activeCellCanMove.includes(index))
			{
				fgColor = "#FFFFFF";
			}
			if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index))
			{
				fgColor = "#000000";
			}
		}
		
		return fgColor;
	}
}