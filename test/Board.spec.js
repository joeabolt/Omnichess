/* For everyone's sanity...
3x3
0  1  2
3  4  5
6  7  8

4x4
0  1  2  3
4  5  6  7
8  9  10 11
12 13 14 15
*/

QUnit.test("Board.Generate2D creates a correct adjacency matrix", function (assert) {
	const expected = [[-1, -1, -1, -1, 0,  1, -1,  3,  4],
					  [-1, -1, -1,  0, 1,  2,  3,  4,  5],
					  [-1, -1, -1,  1, 2, -1,  4,  5, -1],
					  [-1,  0,  1, -1, 3,  4, -1,  6,  7],
					  [ 0,  1,  2,  3, 4,  5,  6,  7,  8],
					  [ 1,  2, -1,  4, 5, -1,  7,  8, -1],
					  [-1,  3,  4, -1, 6,  7, -1, -1, -1],
					  [ 3,  4,  5,  6, 7,  8, -1, -1, -1],
					  [ 4,  5, -1,  7, 8, -1, -1, -1, -1]];
	const actual = Board.Generate2D(3, 3);
	assert.deepEqual(actual, expected);
});

QUnit.test("Board initializes correctly when given an adjacency matrix", function (assert) {
	const adjMatrix = [[-1, -1, -1, -1, 0,  1, -1,  3,  4],
					  [-1, -1, -1,  0, 1,  2,  3,  4,  5],
					  [-1, -1, -1,  1, 2, -1,  4,  5, -1],
					  [-1,  0,  1, -1, 3,  4, -1,  6,  7],
					  [ 0,  1,  2,  3, 4,  5,  6,  7,  8],
					  [ 1,  2, -1,  4, 5, -1,  7,  8, -1],
					  [-1,  3,  4, -1, 6,  7, -1, -1, -1],
					  [ 3,  4,  5,  6, 7,  8, -1, -1, -1],
					  [ 4,  5, -1,  7, 8, -1, -1, -1, -1]];
	const testBoard = new Board(adjMatrix);
	assert.deepEqual(testBoard.cells, adjMatrix);
	assert.deepEqual(testBoard.dimensions, 2);
	assert.deepEqual(testBoard.contents.length, 9);
	for (let i = 0; i < 9; i++)
	{
		assert.deepEqual(testBoard.contents[i], undefined);
	}
});

//////////////////////////////////////
// Begin test Board.GetPathOutput() //
//////////////////////////////////////

QUnit.test("Board.GetPathOutput returns -1 when directed off the board", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	assert.deepEqual(board.GetPathOutput(7, 2, 0, false, false, false, false), -1);
});

QUnit.test("Board.GetPathOutput returns the destination even when directed into an occupied square", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	board.contents[2] = 1;
	assert.deepEqual(board.GetPathOutput(7, 0, -2, false, false, false, false), 1);
});

QUnit.test("Board.GetPathOutput returns the destination when directed along the board", function (assert) {
	const board = new Board(Board.Generate2D(3, 3));
	assert.deepEqual(board.GetPathOutput(7, 0, -2, false, false, false, false), 1);
});

QUnit.test("Board.GetPathOutput behaves the same for uninterrupted paths with any jump flag combination", function (assert) {
	const board = new Board(Board.Generate2D(3, 3));
	assert.deepEqual(board.GetPathOutput(7, 0, -2, false, false, false, false), 1);
	for (let i = 0; i < 8; i++)
	{
		assert.deepEqual(board.GetPathOutput(7, 0, -2, false, false, i%2===0, (i>>1)%2===0), 1);
	}
});

QUnit.test("Board.GetPathOutput returns -1 for uninterrupted paths with any hop flag combination", function (assert) {
	const board = new Board(Board.Generate2D(3, 3));
	assert.deepEqual(board.GetPathOutput(6, 2, -2, false, false, false, false), 2);
	assert.deepEqual(board.GetPathOutput(6, 2, -2, true, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(6, 2, -2, false, true, false, false), -1);
	assert.deepEqual(board.GetPathOutput(6, 2, -2, true, true, false, false), -1);
});

QUnit.test("Board.GetPathOutput blocked by occupied square without jump or hop", function (assert) {
	const board = new Board(Board.Generate2D(3, 3));
	board.contents[4] = 1;
	assert.deepEqual(board.GetPathOutput(0, 2, 2, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(1, 0, 2, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(2, -2, 2, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(3, 2, 0, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(5, -2, 0, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(6, 2, -2, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(7, 0, -2, false, false, false, false), -1);
	assert.deepEqual(board.GetPathOutput(8, -2, -2, false, false, false, false), -1);
});

QUnit.test("Board.GetPathOutput not blocked by occupied square with jump", function (assert) {
	const board = new Board(Board.Generate2D(4, 4));
	board.contents[9] = 1;
	assert.deepEqual(board.GetPathOutput(13, 0, -2, false, false, true, true), 5);
	assert.deepEqual(board.GetPathOutput(13, 0, -3, false, false, true, true), 1);
});

QUnit.test("Board.GetPathOutput with hop stops just past occupied square", function (assert) {
	const board = new Board(Board.Generate2D(4, 4));
	board.contents[9] = 1;
	assert.deepEqual(board.GetPathOutput(13, 0, -2, true, true, false, false), 5);
	assert.deepEqual(board.GetPathOutput(13, 0, -3, true, true, false, false), -1);
});

QUnit.test("Board.GetPathOutput attempts to move diagonally as long as possible", function (assert) {
	const board = new Board(Board.Generate2D(4, 4));
	/* Creates a diagonal corridor so the test will fail if the "walls" are intersected */
	board.contents[5] = 1;
	board.contents[10] = 1;
	board.contents[8] = 1;
	board.contents[13] = 1;
	assert.deepEqual(board.GetPathOutput(12, 3, -2, false, false, false, false), 7);
	assert.deepEqual(board.GetPathOutput(12, 2, -3, false, false, false, false), 2);
});

QUnit.test("Board.GetPathOutput correctly applies different x and y flags", function (assert) {
	const board = new Board(Board.Generate2D(4, 4));
	board.contents[10] = 1;
	assert.deepEqual(board.GetPathOutput(8, 3, 0, false, false, true, false), 11);
	assert.deepEqual(board.GetPathOutput(14, 0, -3, false, false, true, false), -1);
	assert.deepEqual(board.GetPathOutput(15, -2, -3, false, false, true, false), 1);
});

///////////////////////////////////////
// Begin test Board.GetCellIndices() //
///////////////////////////////////////

QUnit.test("Board.GetCellIndices outputs [] when directed off the board", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	const vector = Vector.Create("(1, 0)d")[0];
	const output = board.GetCellIndices(vector, 8, false);
	assert.deepEqual(output, []);
});

QUnit.test("Board.GetCellIndices outputs the destination when directed along the board", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	const vector = Vector.Create("(1, 0)d")[0];
	const output = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(output, [8]);
});

QUnit.test("Board.GetCellIndices returns all possible destinations for multi-length vectors", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	const vector = Vector.Create("(0, -1{2})d")[0];
	const output = board.GetCellIndices(vector, 7, false);
	assert.deepEqual(output.length, 2);
	assert.ok(output.includes(4));
	assert.ok(output.includes(1));
});

QUnit.test("Board.GetCellIndices ignores occupied cells without capture", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
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
	const board = new Board(Board.Generate2D(3, 3));
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
	const board = new Board(Board.Generate2D(4, 4));
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
	const board = new Board(Board.Generate2D(4, 4));
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
	const board = new Board(Board.Generate2D(4, 4));
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
	const board = new Board(Board.Generate2D(4, 4));
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
	const board = new Board(Board.Generate2D(5, 5));
	board.contents[5] = 1;
	board.contents[15] = 1;
	const vector = Vector.Create("(0, -1{5})djh")[0];
	
	const output = board.GetCellIndices(vector, 20, false);
	assert.deepEqual(output.length, 2);
	assert.ok(output.includes(10));
	assert.ok(output.includes(0));
});
