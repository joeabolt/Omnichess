QUnit.test("Turn constructor creates a turn with the passed elements", function (assert)
{
    const actual = new Turn(1, 2, 3);
	assert.deepEqual(1, actual.player);
	assert.deepEqual(2, actual.board);
	assert.deepEqual(3, actual.legalActions);
});

QUnit.test("Turn.EndTurn() has no default behavior (returns undefined)", function (assert)
{
	const actual = new Turn(1, 2, 3);
	assert.deepEqual(undefined, actual.EndTurn());
	/* Asserting values unchanged */
	assert.deepEqual(1, actual.player);
	assert.deepEqual(2, actual.board);
	assert.deepEqual(3, actual.legalActions);
});

QUnit.test("Turn.Validate() invalidates moves for the wrong player", function(assert)
{
	const move = {
		move: true,
		capture: false,
		source: 0
	};
	const board = {
		contents: [{player: 0}, {player: 1}, {player: 1}]
	}
	const legalActions = {
		move: true,
		capture: true,
		piece: undefined
	};
	const turn = new Turn(1, board, legalActions);
	try
	{
		assert.notOk(turn.Validate(move));
	}
	catch (err)
	{
		/* Move successfully invalidated */
		assert.ok(true);
	}
});

QUnit.test("Turn.Validate() invalidates movement when movement disallowed", function(assert)
{
	const move = {
		move: true,
		capture: false,
		source: 0
	};
	const board = {
		contents: [{player: 1}, {player: 1}, {player: 1}]
	}
	const legalActions = {
		move: false,
		capture: true,
		piece: undefined
	};
	const turn = new Turn(1, board, legalActions);
	try
	{
		assert.notOk(turn.Validate(move));
	}
	catch (err)
	{
		/* Move successfully invalidated */
		assert.ok(true);
	}
});

QUnit.test("Turn.Validate() invalidates capture when capture disallowed", function(assert)
{
	const move = {
		move: false,
		capture: true,
		source: 0
	};
	const board = {
		contents: [{player: 1}, {player: 1}, {player: 1}]
	}
	const legalActions = {
		move: true,
		capture: false,
		piece: undefined
	};
	const turn = new Turn(1, board, legalActions);
	try
	{
		assert.notOk(turn.Validate(move));
	}
	catch (err)
	{
		/* Move successfully invalidated */
		assert.ok(true);
	}
});

QUnit.test("Turn.Validate() accepts valid moves", function(assert)
{
	const move = {
		move: false,
		capture: true,
		source: 0
	};
	const board = {
		contents: [{player: 1}, {player: 1}, {player: 1}]
	}
	const legalActions = {
		move: true,
		capture: true,
		piece: undefined
	};
	const turn = new Turn(1, board, legalActions);
	try
	{
		assert.ok(turn.Validate(move));
	}
	catch (err)
	{
		/* Move incorrectly invalidated */
		assert.ok(false);
	}
});
