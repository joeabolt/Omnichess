/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
		
		let lineSegment = "+";
		this.cellLength = ("" + this.board.contents.length).length;
		for (let i = 0; i < this.cellLength; i++)
		{
			lineSegment += "-";
		}
		this.intermediateLine = "";
		this.cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
		for (let i = 0; i < this.cellsPerRow; i++)
		{
			this.intermediateLine += lineSegment;
		}
		this.intermediateLine += "+";
		
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
		// TODO: Dark magic to output the state of the game
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
	
	CreateDisplayBoard()
	{
		console.log("Creating the display board.");
		let board = this.intermediateLine + "<br />";
		for (let row = 0; row < this.cellsPerRow; row++)
		{
			for (let col = 0; col < this.cellsPerRow; col++)
			{
				let stringToAdd = "|" + (row * this.cellsPerRow + col);
				/* cellLength + 1 accounts for the separators between cells */
				for (let spacing = stringToAdd.length; spacing < this.cellLength + 1; spacing++)
				{
					stringToAdd += " ";
				}
				board += stringToAdd;
			}
			board += "|<br />";
			/* This loop adds the actual contents of the cells */
			for (let col = 0; col < this.cellsPerRow; col++)
			{
				/* Obtain the contents of this cell, as a string */
				let contents = this.board.contents[row * this.cellsPerRow + col];
				contents = contents == undefined ? "" : contents.identifier;
				
				/* Pad it to length, centered */
				for (let i = 0; contents.length < this.cellLength; i++)
				{
					if (i % 0 == 0)
					{
						contents = contents.padEnd(contents.length + 1);
					}
					else
					{
						contents = contents.padStart(contents.length + 1);
					}
				}
				
				board += "|" + contents;
			}
			board += "|<br />" + this.intermediateLine + "<br />";
		}
		board = board.replace(/\s(?!\/>)/g, "&nbsp");
		
		return board;
	}
}