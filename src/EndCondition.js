const {Metrics} = require("./Metrics.js");

/** Stores and checks a condition that could end the game
 *  Notated as:
 *    count piece_ident = 0 @ start player_ident (also <, >, and end instead of start)
 *    check piece_ident @ end player_ident
 */
class EndCondition {
    constructor(player, win, configurationString) {
        this.player = player;
        this.state = win ? 1 : -1;
        this.configurationString = configurationString;
        this.pieceType = this.configurationString.trim().split(" ")[1];
    }

    EvaluateGame(board, lastTurn, nextTurn) {
        /* Tests that this EndCondition applies either at the end of the
         * last player's turn or at the beginning of the next player's turn;
         * if not, this if is true and an inconclusive result (0) is returned.
         */
        if (!this.configurationString.includes(`@ end ${lastTurn.player.identifier}`)
            && !this.configurationString.includes(`@ start ${nextTurn.player.identifier}`)) {
            /* This condition does not apply at this time */
            return 0;
        }

        /* Evaluate */
        const words = this.configurationString.trim().split(" ");
        if (words[0] === "count") {
            const pieceCount = board.contents.filter(
                (piece) => piece && piece.player === this.player && piece.identifier === words[1]
            ).length;
            
            if (words[2] === "=" && pieceCount === Number(words[3])) {
                return this.state;
            }
            if (words[2] === "<" && pieceCount < Number(words[3])) {
                return this.state;
            }
            if (words[2] === ">" && pieceCount > Number(words[3])) {
                return this.state;
            }
            return 0;
        }
        if (words[0] === "check") {
            // Check if all instances of this.player's this.pieceType are in check
            const checkmate = Metrics.getAllAlliedPieceLocationsByType(board, this.player, this.pieceType).every(location => {
                return Metrics.isCheckmated(board, location);
            });
            if (checkmate) {
                return this.state;
            }
        }

        return 0;
    }
}

if (typeof window === 'undefined') {
    module.exports.EndCondition = EndCondition;
}