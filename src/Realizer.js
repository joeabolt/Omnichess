/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		this.moveQueue = [];
		this.moveQueueMutex = false;
		
		this.cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
		
		this.displayBoard = this.CreateDisplayBoard();
	}
	
	/**
	 * Method to be called by the front-end. Can be called multiple
	 * times without incurring computational cost if no update is
	 * available. Outputs the current state of the board.
	 */
	Realize()
	{
		if (this.isFullyUpdated)
		{
			return;
		}
		document.getElementById("output").innerHTML = this.displayBoard;
		this.isFullyUpdated = true;
		console.log("Updated the display.");
	}
	
	/**
	 * Causes the realizer to update its representation of the
	 * stored board. Should be called by the back-end. Incurs
	 * computational cost each time it is run.
	 */
	Update()
	{
		// Keep track of what we are supposed to display
		this.displayBoard = this.CreateDisplayBoard();
		this.isFullyUpdated = false;
	}
	
	GetMove()
	{
		while (this.moveQueueMutex);
		this.moveQueueMutex = true;
		const move = this.moveQueue.shift();
		this.moveQueueMutex = false;
		return move;
	}
	
	InputMove(move)
	{
		/* Parse move into object */
		const moveObject = {};
		moveObject.move = move.includes("->");
		moveObject.capture = move.includes("x");
		moveObject.source = Number(move.match(/^\d+/));
		moveObject.target = Number(move.match(/\d+^/));
		
		/* Load move */
		while (this.moveQueueMutex);
		this.moveQueueMutex = true;
		this.moveQueue.push(moveObject);
		this.moveQueueMutex = false;
	}
	
	CreateDisplayBoard()
	{
		console.log("Creating the display board.");
		let board = "<table>";
		for (let row = 0; row < this.cellsPerRow; row++)
		{
			board += "<tr>";
			for (let col = 0; col < this.cellsPerRow; col++)
			{
				const index = row * this.cellsPerRow + col;
				
				/* Obtain the contents of this cell, as a string */
				let contents = this.board.contents[index];
				contents = contents == undefined ? "&nbsp" : contents.identifier;
				
				const darkBackground = (row % 2 == 0) ^ (col % 2 == 0);
				
				board += `<td style="background-color: #${darkBackground ? "000000" : "ffffff"};
					color: #${darkBackground ? "ffffff" : "000000"};">${index}<br />${contents}</td>`;
			}
			board += "</tr>";
		}
		board += "</table>";
		
		return board;
	}
}