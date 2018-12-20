/** Stores and checks a condition that could end the game
 *  Notated as:
 *    count piece_ident = 0 @ start player_ident (also <, >, and end instead of start)
 *    check piece_ident @ end player_ident
 */
class EndCondition
{
	constructor(player, win, configurationString)
	{
		this.player = player;
		this.state = win ? 1 : -1;
		this.configurationString = configurationString;
	}
	
	EvaluateGame(board, lastTurn, nextTurn)
	{
		if ((lastTurn === undefined || !this.configurationString.includes(`@ end ${lastTurn.player.identifier}`))
			&& !this.configurationString.includes(`@ start ${nextTurn.player.identifier}`))
		{
			/* This condition does not apply at this time */
			return 0;
		}
		
		/* Evaluate */
		const words = this.configurationString.trim().split(" ");
		if (words[0] === "count")
		{
			let pieceCount = 0;
			board.contents.forEach((piece) => {
				if (piece === undefined)
				{
					return;
				}
				if (piece.player === this.player && piece.identifier === words[1])
				{
					pieceCount++;
				}
			});
			if (words[2] === "=" && pieceCount === Number(words[3]))
			{
				return this.state;
			}
			if (words[2] === "<" && pieceCount < Number(words[3]))
			{
				return this.state;
			}
			if (words[2] === ">" && pieceCount > Number(words[3]))
			{
				return this.state;
			}
			return 0;
		}
		if (words[1] === "check")
		{
			// TODO: Implement the check end condition
		}
		
		return 0;
	}
}