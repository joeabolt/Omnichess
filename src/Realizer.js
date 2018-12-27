/* Manages the display of the board to the user */
class Realizer 
{
	constructor(game)
	{
		this.game = game;
		this.board = game.board;
		this.isFullyUpdated = false;
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
		this.isFullyUpdated = false;
	}
}