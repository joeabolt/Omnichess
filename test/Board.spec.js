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