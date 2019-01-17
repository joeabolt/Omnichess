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
	const expected = [[-1, -1, -1, -1, 0, 1, -1, 3, 4],
		[-1, -1, -1, 0, 1, 2, 3, 4, 5],
		[-1, -1, -1, 1, 2, -1, 4, 5, -1],
		[-1, 0, 1, -1, 3, 4, -1, 6, 7],
		[0, 1, 2, 3, 4, 5, 6, 7, 8],
		[1, 2, -1, 4, 5, -1, 7, 8, -1],
		[-1, 3, 4, -1, 6, 7, -1, -1, -1],
		[3, 4, 5, 6, 7, 8, -1, -1, -1],
		[4, 5, -1, 7, 8, -1, -1, -1, -1]];
	const actual = Board.Generate2D(3, 3);
	assert.deepEqual(actual, expected);
});

QUnit.test("Board initializes correctly when given an adjacency matrix", function (assert) {
	const adjMatrix = [[-1, -1, -1, -1, 0, 1, -1, 3, 4],
		[-1, -1, -1, 0, 1, 2, 3, 4, 5],
		[-1, -1, -1, 1, 2, -1, 4, 5, -1],
		[-1, 0, 1, -1, 3, 4, -1, 6, 7],
		[0, 1, 2, 3, 4, 5, 6, 7, 8],
		[1, 2, -1, 4, 5, -1, 7, 8, -1],
		[-1, 3, 4, -1, 6, 7, -1, -1, -1],
		[3, 4, 5, 6, 7, 8, -1, -1, -1],
		[4, 5, -1, 7, 8, -1, -1, -1, -1]];
	const testBoard = new Board(adjMatrix);
	assert.deepEqual(testBoard.cells, adjMatrix);
	assert.deepEqual(testBoard.dimensions, 2);
	assert.deepEqual(testBoard.contents.length, 9);
	for (let i = 0; i < 9; i++)
	{
		assert.deepEqual(testBoard.contents[i], undefined);
	}
});

QUnit.test("Board.GetPathOutput returns -1 when directed off the board", function(assert) {
	const board = new Board(Board.Generate2D(3, 3));
	assert.deepEqual(board.GetPathOutput(7, 2, 0, false, false, false, false), -1);
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

QUnit.test("Board.GetPathOutput not blocked by occupied square with hop", function (assert) {
	const board = new Board(Board.Generate2D(4, 4));
	board.contents[9] = 1;
	assert.deepEqual(board.GetPathOutput(13, 0, -2, true, true, false, false), 5);
	assert.deepEqual(board.GetPathOutput(13, 0, -3, true, true, false, false), -1);
});