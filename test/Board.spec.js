/* For everyone's sanity...
3x3
1  2  3
4  5  6
7  8  9

4x4
1  2  3  4
5  6  7  8
9  10 11 12
13 14 15 16
*/

QUnit.test("Board.Generate creates a correct adjacency matrix", function (assert) {
	const expected = [[null, null, null, null, 1,  2, null,  4,  5],
					  [null, null, null,  1, 2,  3,  4,  5,  6],
					  [null, null, null,  2, 3, null,  5,  6, null],
					  [null,  1,  2, null, 4,  5, null,  7,  8],
					  [ 1,  2,  3,  4, 5,  6,  7,  8,  9],
					  [ 2,  3, null,  5, 6, null,  8,  9, null],
					  [null,  4,  5, null, 7,  8, null, null, null],
					  [ 4,  5,  6,  7, 8,  9, null, null, null],
					  [ 5,  6, null,  8, 9, null, null, null, null]];
	const actual = Board.Generate([3, 3]);
	assert.deepEqual(actual, expected);
});

QUnit.test("Board initializes correctly when given an adjacency matrix", function (assert) {
	const adjMatrix = [[null, null, null, null, 1,  2, null,  4,  5],
					  [null, null, null,  1, 2,  3,  4,  5,  6],
					  [null, null, null,  2, 3, null,  5,  6, null],
					  [null,  1,  2, null, 4,  5, null,  7,  8],
					  [ 1,  2,  3,  4, 5,  6,  7,  8,  9],
					  [ 2,  3, null,  5, 6, null,  8,  9, null],
					  [null,  4,  5, null, 7,  8, null, null, null],
					  [ 4,  5,  6,  7, 8,  9, null, null, null],
					  [ 5,  6, null,  8, 9, null, null, null, null]];
	const testBoard = new Board(adjMatrix);
	assert.deepEqual(testBoard.cells, adjMatrix);
	assert.deepEqual(testBoard.dimensions, 2);
	assert.deepEqual(testBoard.contents.length, 10); /* Include unused 0 cell */
	for (let i = 0; i < 9; i++)
	{
		assert.deepEqual(testBoard.contents[i], undefined);
	}
});

//////////////////////////////////////
// Begin test Board.GetPathOutput() //
//////////////////////////////////////

QUnit.test("Board.GetPathOutput returns null when directed off the board", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const xComp = new Component(1, 4, false, false, false);
	const yComp = new Component(0, 4, false, false, false);
	assert.deepEqual(board.GetPathOutput(7, [xComp, yComp], 3), null);
});

QUnit.test("Board.GetPathOutput returns the destination even when directed into an occupied square", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	board.contents[2] = 1;
	const xComp = new Component(0, 4, false, false, false);
	const yComp = new Component(-1, 4, false, false, false);
	assert.deepEqual(board.GetPathOutput(7, [xComp, yComp], 2), 1);
});

QUnit.test("Board.GetPathOutput returns the destination when directed along the board", function (assert) {
	const board = new Board(Board.Generate([3, 3]));
	const xComp = new Component(0, 4, false, false, false);
	const yComp = new Component(-1, 4, false, false, false);
	assert.deepEqual(board.GetPathOutput(7, [xComp, yComp], 2), 1);
});

QUnit.test("Board.GetPathOutput behaves the same for uninterrupted paths with any jump flag combination", function (assert) {
	const board = new Board(Board.Generate([3, 3]));
	const zeroComp = new Component(0, 4, false, false, false);
	const zeroJumpComp = new Component(0, 4, true, false, false);
	const negOneComp = new Component(-1, 4, false, false, false);
	const negOneJumpComp = new Component(-1, 4, true, false, false);
	assert.deepEqual(board.GetPathOutput(7, [zeroComp, negOneComp], 2), 1);
	assert.deepEqual(board.GetPathOutput(7, [zeroJumpComp, negOneComp], 2), 1);
	assert.deepEqual(board.GetPathOutput(7, [zeroComp, negOneJumpComp], 2), 1);
	assert.deepEqual(board.GetPathOutput(7, [zeroJumpComp, negOneJumpComp], 2), 1);
});

QUnit.test("Board.GetPathOutput returns null for uninterrupted paths with any hop flag combination", function (assert) {
	const board = new Board(Board.Generate([3, 3]));
	const oneComp = new Component(1, 4, false, false, false);
	const oneHopComp = new Component(1, 4, false, true, false);
	const negOneComp = new Component(-1, 4, false, false, false);
	const negOneHopComp = new Component(-1, 4, false, true, false);
	assert.deepEqual(board.GetPathOutput(7, [oneComp, negOneComp], 2), 3);
	assert.deepEqual(board.GetPathOutput(7, [oneComp, negOneHopComp], 2), null);
	assert.deepEqual(board.GetPathOutput(7, [oneHopComp, negOneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(7, [oneHopComp, negOneHopComp], 2), null);
});

QUnit.test("Board.GetPathOutput blocked by occupied square without jump or hop", function (assert) {
	const board = new Board(Board.Generate([3, 3]));
	board.contents[5] = 1;
	const zeroComp = new Component(0, 4, false, false, false);
	const oneComp = new Component(1, 4, false, false, false);
	const negOneComp = new Component(-1, 4, false, false, false);
	assert.deepEqual(board.GetPathOutput(1, [oneComp, oneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(2, [zeroComp, oneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(3, [negOneComp, oneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(4, [oneComp, zeroComp], 2), null);
	assert.deepEqual(board.GetPathOutput(6, [negOneComp, zeroComp], 2), null);
	assert.deepEqual(board.GetPathOutput(7, [oneComp, negOneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(8, [zeroComp, negOneComp], 2), null);
	assert.deepEqual(board.GetPathOutput(9, [negOneComp, negOneComp], 2), null);
});

QUnit.test("Board.GetPathOutput not blocked by occupied square with jump", function (assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[10] = 1;
	const zeroJumpComp = new Component(0, 4, true, false, false);
	const negOneJumpComp = new Component(-1, 4, true, false, false);
	assert.deepEqual(board.GetPathOutput(13, [zeroJumpComp, negOneJumpComp], 2), 5);
	assert.deepEqual(board.GetPathOutput(13, [zeroJumpComp, negOneJumpComp], 3), 1);
});

QUnit.test("Board.GetPathOutput with hop stops just past occupied square", function (assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[9] = 1;
	const zeroHopComp = new Component(0, 4, false, true, false);
	const negOneHopComp = new Component(-1, 4, false, true, false);
	assert.deepEqual(board.GetPathOutput(13, [zeroHopComp, negOneHopComp], 2), 5);
	assert.deepEqual(board.GetPathOutput(13, [zeroHopComp, negOneHopComp], 3), null);
});

QUnit.test("Board.GetPathOutput attempts to move diagonally as long as possible", function (assert) {
	const board = new Board(Board.Generate([4, 4]));
	/* Creates a diagonal corridor so the test will fail if the "walls" are intersected */
	board.contents[6] = 1;
	board.contents[11] = 1;
	board.contents[9] = 1;
	board.contents[14] = 1;
	const threeComp = new Component(3, 1, false, false, false);
	const negThreeComp = new Component(-3, 1, false, false, false);
	const twoComp = new Component(2, 1, false, false, false);
	const negTwoComp = new Component(-2, 1, false, false, false);
	assert.deepEqual(board.GetPathOutput(13, [threeComp, negTwoComp], 1), 8);
	assert.deepEqual(board.GetPathOutput(13, [twoComp, negThreeComp], 1), 3);
});

QUnit.test("Board.GetPathOutput correctly applies different x and y flags", function (assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[10] = 1;
	assert.deepEqual(board.GetPathOutput(8, 3, 0, false, false, true, false), 11);
	assert.deepEqual(board.GetPathOutput(14, 0, -3, false, false, true, false), null);
	assert.deepEqual(board.GetPathOutput(15, -2, -3, false, false, true, false), 1);
});

///////////////////////////////////////
// Begin test Board.GetCellIndices() //
///////////////////////////////////////

QUnit.test("Board.GetCellIndices outputs [] when directed off the board", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const vector = Vector.Create("(1, 0)d")[0];
	const output = board.GetCellIndices(vector, 8, false);
	assert.deepEqual(output, []);
});

QUnit.test("Board.GetCellIndices outputs the destination when directed along the board", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const vector = Vector.Create("(1, 0)d")[0];
	const output = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(output, [8]);
});

QUnit.test("Board.GetCellIndices returns all possible destinations for multi-length vectors", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const vector = Vector.Create("(0, -1{2})d")[0];
	const output = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(output.length, 2);
	assert.ok(output.includes(4));
	assert.ok(output.includes(1));
});

QUnit.test("Board.GetCellIndices ignores occupied cells without capture", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const vector = Vector.Create("(0, -1{2})d")[0];
	
	const unblocked = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(unblocked.length, 2);
	assert.ok(unblocked.includes(4));
	assert.ok(unblocked.includes(1));
	
	board.contents[1] = 1;
	const blocked = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(blocked.length, 1);
	assert.ok(blocked.includes(4));
});

QUnit.test("Board.GetCellIndices includes occupied cells with capture", function(assert) {
	const board = new Board(Board.Generate([3, 3]));
	const vector = Vector.Create("(0, -1{2})d")[0];
	
	const unblocked = board.GetCellIndices(vector, 7, true);
	assert.deepEqual(unblocked.length, 2);
	assert.ok(unblocked.includes(4));
	assert.ok(unblocked.includes(1));
	
	board.contents[1] = 1;
	const blocked = board.GetCellIndices(vector, 7, true);
	assert.deepEqual(blocked.length, 2);
	assert.ok(blocked.includes(4));
	assert.ok(blocked.includes(1));
});

QUnit.test("Board.GetCellIndices handles jump correctly", function(assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[9] = 1;
	const vector = Vector.Create("(0, -1{3})dj")[0];
	
	const withoutCapture = board.GetCellIndices(vector, 13, false);
	assert.deepEqual(withoutCapture.length, 2);
	assert.ok(withoutCapture.includes(5));
	assert.ok(withoutCapture.includes(1));
	
	const withCapture = board.GetCellIndices(vector, 13, true);
	assert.deepEqual(withCapture.length, 3);
	assert.ok(withCapture.includes(9));
	assert.ok(withoutCapture.includes(5));
	assert.ok(withoutCapture.includes(1));
});

QUnit.test("Board.GetCellIndices handles hop correctly", function(assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[9] = 1;
	const vector = Vector.Create("(0, -1{3})dh")[0];
	
	const singleHop = board.GetCellIndices(vector, 13, false);
	assert.deepEqual(singleHop.length, 1);
	assert.ok(singleHop.includes(5));
	
	board.contents[5] = 1;
	const doubleHop = board.GetCellIndices(vector, 13, false);
	assert.deepEqual(doubleHop.length, 1);
	assert.ok(doubleHop.includes(1));
});

QUnit.test("Board.GetCellIndices handles hop identically with or without capture", function(assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[9] = 1;
	const vector = Vector.Create("(0, -1{3})dh")[0];
	
	const singleHop = board.GetCellIndices(vector, 13, false);
	assert.deepEqual(singleHop.length, 1);
	assert.ok(singleHop.includes(5));
	
	const singleHopCapture = board.GetCellIndices(vector, 13, true);
	assert.deepEqual(singleHopCapture.length, 1);
	assert.ok(singleHopCapture.includes(5));
});

QUnit.test("Board.GetCellIndices handles hop identically with or without capture", function(assert) {
	const board = new Board(Board.Generate([4, 4]));
	board.contents[9] = 1;
	const vector = Vector.Create("(0, -1{3})dh")[0];
	
	const singleHop = board.GetCellIndices(vector, 13, false);
	assert.deepEqual(singleHop.length, 1);
	assert.ok(singleHop.includes(5));
	
	const singleHopCapture = board.GetCellIndices(vector, 13, true);
	assert.deepEqual(singleHopCapture.length, 1);
	assert.ok(singleHopCapture.includes(5));
});

QUnit.test("Board.GetCellIndices handles jump and hop together", function(assert) {
	const board = new Board(Board.Generate([5, 5]));
	board.contents[5] = 1;
	board.contents[15] = 1;
	const vector = Vector.Create("(0, -1{5})djh")[0];
	
	const output = board.GetCellIndices(vector, 20, false);
	assert.deepEqual(output.length, 2);
	assert.ok(output.includes(10));
	assert.ok(output.includes(0));
});
