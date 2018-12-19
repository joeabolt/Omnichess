/* Initial script */

console.log(Vector.Create("(2p, 1{3})j; (1, 0)d;"));
console.log(Vector.Create("(1, 1{3}+)"));

const queen = new Piece();
queen.setMoveVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	.setMoveCaptureVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	.setPlayer("Alice");
console.log(queen);

const queenObj = {};
queenObj.move = "(1, 0)+;(0, 1)+;(1, 1)+";
queenObj.capture = "";
queenObj.moveCapture = "(1, 0)+;(0, 1)+;(1, 1)+";
queenObj.player = "Bob";
console.log(Piece.Create(queenObj));

/* Testing Board */

const board = Board.Create({dimensions:"3x3"});
console.log(board);

/* Uses var to allow redecleration in later tests */
// TODO: Update away from var when a testing solution is decided upon
console.log("Test navigation: (0, 1)d");
var testVector = Vector.Create("(0, 1)d")[0];
var output = board.GetCellIndices(testVector, 4);
console.log(output.size == 1);
console.log(output.has(1));

console.log("Test navigation: (1, 0)d");
testVector = Vector.Create("(1, 0)d")[0];
output = board.GetCellIndices(testVector, 4);
console.log(output.size == 1);
console.log(output.has(5));

console.log("Test navigation: (1, 0)d+");
testVector = Vector.Create("(1, 0)d+")[0];
output = board.GetCellIndices(testVector, 0);
console.log(output.size == 2);
console.log(output.has(1));
console.log(output.has(2));

console.log("Test navigation: (1, 0)j+");
testVector = Vector.Create("(1, 0)j+")[0];
board.contents[1] = 1;
output = board.GetCellIndices(testVector, 0);
board.contents[1] = undefined;
console.log(output.size == 1);
console.log(output.has(2));

console.log("Test navigation: (1, 0j)+ with obstacle");
testVector = Vector.Create("(1, 0j)j")[0];
board.contents[1] = 1;
output = board.GetCellIndices(testVector, 0);
board.contents[1] = undefined;
console.log(output.size == 0);

console.log("Test navigation: (1, 0)h+");
testVector = Vector.Create("(1, 0)h+")[0];
board.contents[1] = 1;
output = board.GetCellIndices(testVector, 0);
board.contents[1] = undefined;
console.log(output.size == 1);
console.log(output.has(2));
