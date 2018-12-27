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
		for (let i = 0; i < cellLength; i++)
		{
			lineSegment += "-";
		}
		this.intermediateLine = "";
		let cellsPerRow = Math.round(Math.sqrt(this.board.contents.length));
		for (let i = 0; i < cellsPerRow; i++)
		{
			this.intermediateLine += lineSegment;
		}
		this.intermediateLine += "+";
		
		this.displayBoard = CreateDisplayBoard();
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
	}
	
	/**
	 * Causes the realizer to update its representation of the
	 * stored board. Should be called by the back-end. Incurs
	 * computational cost each time it is run.
	 */
	Update()
	{
		// Keep track of what we are supposed to display
		this.displayBoard = CreateDisplayBoard();
		this.isFullyUpdated = false;
	}
	
	CreateDisplayBoard()
	{
		let board = this.intermediateLine + "<br />";
		for (let row = 0; row < cellsPerRow; row++)
		{
			for (let col = 0; col < cellsPerRow; col++)
			{
				let stringToAdd = "|" + (row * cellsPerRow + col);
				/* cellLength + 1 accounts for the separators between cells */
				for (let spacing = stringToAdd.length; spacing < cellLength + 1; spacing++)
				{
					stringToAdd += " ";
				}
				board += stringToAdd;
			}
			board += "|<br />";
			/* This loop adds the actual contents of the cells */
			for (let col = 0; col < cellsPerRow; col++)
			{
				/* Obtain the contents of this cell, as a string */
				let contents = this.board.contents[row * cellsPerRow + col];
				contents = contents == undefined ? "" : contents.identifier;
				
				/* Pad it to length, centered */
				for (let i = 0; contents.length < cellLength; i++)
				{
					if (i % 0 == 0)
					{
						contents.padStart(contents.length + 1);
					}
					else
					{
						contents.padEnd(contents.length + 1);
					}
				}
				
				board += "|" + contents;
			}
			board += "|<br />";
		}
		
		return board;
	}
}