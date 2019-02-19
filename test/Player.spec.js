QUnit.test("Player constructor correctly assigns variables", function (assert) {
	const expectedIdentifier = 1;
	const expectedDirection = [1, 1];
	const expectedDropablePieces = [2];
	const expectedCapturedPieces = [3];
	const expectedColor = 4;
	
	const player = new Player(expectedIdentifier, expectedDirection, expectedDropablePieces, expectedCapturedPieces, expectedColor);
	
	assert.deepEqual(player.identifier, expectedIdentifier);
	assert.deepEqual(player.direction, expectedDirection);
	assert.deepEqual(player.dropablePieces, expectedDropablePieces);
	assert.deepEqual(player.capturedPieces, expectedCapturedPieces);
	assert.deepEqual(player.color, expectedColor);
});

QUnit.test("Player constructor default assigns color to undefined", function (assert) {
	const expectedIdentifier = 1;
	const expectedDirection = [1, 1];
	const expectedDropablePieces = [2];
	const expectedCapturedPieces = [3];
	const expectedColor = undefined;
	
	const player = new Player(expectedIdentifier, expectedDirection, expectedDropablePieces, expectedCapturedPieces);
	
	assert.deepEqual(player.identifier, expectedIdentifier);
	assert.deepEqual(player.direction, expectedDirection);
	assert.deepEqual(player.dropablePieces, expectedDropablePieces);
	assert.deepEqual(player.capturedPieces, expectedCapturedPieces);
	assert.deepEqual(player.color, expectedColor);
});