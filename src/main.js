/* Initial script */

const alice = new Player("alice", [1, 1], [], []);
const bob = new Player("bob", [-1, 1], [], []);
const board = new Board(Board.Generate2D(3, 3));

const rook_alice = new Piece()
	.setPlayer(alice)
	.setIdentifier("rook")
	.setMoveCaptureVectors(Vector.Create("(1, 0)+; (0, 1)+;"));

const bishop_bob = new Piece()
	.setPlayer(bob)
	.setIdentifier("bishop")
	.setMoveCaptureVectors(Vector.Create("(1, 1)+;"));

board.contents[7] = rook_alice;
board.contents[1] = bishop_bob;

const alice_lose = new EndCondition(alice, false, "count rook = 0 @ end bob");
const bob_lose = new EndCondition(bob, false, "count bishop = 0 @ end alice");

const testMove = {};
testMove.source = 7;
testMove.target = 1;
testMove.move = true;
testMove.capture = true;
testMove.drop = false;
testMove.promote = false;

const game = new Game(board, [alice, bob], [alice_lose, bob_lose]);
console.log(`Game status: ${game.gameState}`);
game.CheckGameEnd();
console.log(`Game status: ${game.gameState}`);
game.DoTurn_Test(testMove);
console.log(`Board.contents[1] = ${board.contents[1]}`);
console.log(`Board.contents[7] = ${board.contents[7]}`);
console.log(`Game status: ${game.gameState}`);
game.CheckGameEnd();
console.log(`Game status: ${game.gameState}`);
