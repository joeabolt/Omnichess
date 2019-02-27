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
		this.activeCellCanMoveCapture = [];
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
		if (this.activeCell === undefined)
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
		this.SetActiveCell(clickedCell);
	}
	
	SetActiveCell(newActiveCell)
	{
		this.activeCell = newActiveCell;
		this.activeCellCanMove = [];
		this.activeCellCanCapture = [];
		this.activeCellCanMoveCapture = [];
		
		if (this.activeCell !== undefined && this.board.contents[this.activeCell] !== undefined)
		{
			const activePiece = this.board.contents[this.activeCell];
			
			activePiece.moveVectors.forEach((vector) => {
				this.activeCellCanMove.push(...this.board.GetCellIndices(vector, this.activeCell, false));
			});
			this.activeCellCanMove = [...new Set(this.activeCellCanMove)];
			
			activePiece.captureVectors.forEach((vector) => {
				this.activeCellCanCapture.push(...this.board.GetCellIndices(vector, this.activeCell, true, true));
			});
			this.activeCellCanCapture = [...new Set(this.activeCellCanCapture)];

			activePiece.moveCaptureVectors.forEach((vector) => {
				this.activeCellCanMoveCapture.push(...this.board.GetCellIndices(vector, this.activeCell, true, true));
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
		this.activeCell = undefined;
		this.Realize();
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
				const backgroundColor = this.DetermineBackgroundColor(toDisplay[r][c], r, c);
				const foregroundColor = this.DetermineForegroundColor(toDisplay[r][c], r, c);
				
				if (this.board.contents[toDisplay[r][c]] !== undefined)
				{
					contents = this.board.contents[toDisplay[r][c]].identifier;
				}

				cell.style.backgroundColor = backgroundColor;
				cell.style.color = foregroundColor;
				
				const size = "35px"; //TODO: Make this dynamic #55
				cell.style.width = size;
				cell.style.height = size;
				
				cell.innerHTML = `${toDisplay[r][c]}<br />${contents}`;
				cell.onclick = () => { processClick(event, toDisplay[r][c]); };

			}
		}
		
		return board;
	}
	
	DetermineBackgroundColor(index, row, column)
	{
		if (index < 0)
		{
			return "#AAAAAA";
		}
		
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
			if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index))
			{
				bgColor = "#FF0000";
			}
		}
		
		return bgColor;
	}
	
	DetermineForegroundColor(index, row, column)
	{
		if (index < 0)
		{
			return "#FFFFFF";
		}
		
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
			if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index))
			{
				fgColor = "#000000";
			}
		}
		
		return fgColor;
	}
}