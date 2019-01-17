QUnit.test("Piece constructor makes an empty piece", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.moveVectors, []);
	assert.deepEqual(piece.captureVectors, []);
	assert.deepEqual(piece.moveCaptureVectors, []);
	assert.deepEqual(piece.identifier, "");
	assert.deepEqual(piece.player, undefined);
});

QUnit.test("Piece.setMoveVectors correctly sets moveVectors", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.moveVectors, []);
	
	piece.setMoveVectors(2);
	assert.deepEqual(piece.moveVectors, 2);
});

QUnit.test("Piece.setCaptureVectors correctly sets captureVectors", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.captureVectors, []);
	
	piece.setCaptureVectors(2);
	assert.deepEqual(piece.captureVectors, 2);
});

QUnit.test("Piece.setMoveCaptureVectors correctly sets moveCaptureVectors", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.moveCaptureVectors, []);
	
	piece.setMoveCaptureVectors(2);
	assert.deepEqual(piece.moveCaptureVectors, 2);
});

QUnit.test("Piece.setIdentifier correctly sets identifier", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.identifier, "");
	
	piece.setIdentifier(2);
	assert.deepEqual(piece.identifier, 2);
});

QUnit.test("Piece.setPlayer correctly sets player", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.player, undefined);
	
	piece.setPlayer(2);
	assert.deepEqual(piece.player, 2);
});

QUnit.test("Piece.setDirection correctly inverts vectors", function (assert) {
	const piece = new Piece();
	piece.setMoveVectors(Vector.Create("(1, 0)d"));
	assert.deepEqual(piece.moveVectors.length, 1);
	assert.deepEqual(piece.moveVectors[0].components[0].length, 1);
	assert.deepEqual(piece.moveVectors[0].components[1].length, 0);
	
	piece.setDirection([1, -1]);
	assert.deepEqual(piece.moveVectors.length, 1);
	assert.deepEqual(piece.moveVectors[0].components[0].length, 1);
	assert.deepEqual(piece.moveVectors[0].components[1].length, 0);
	
	piece.setDirection([-1, 1]);
	assert.deepEqual(piece.moveVectors.length, 1);
	assert.deepEqual(piece.moveVectors[0].components[0].length, -1);
	assert.deepEqual(piece.moveVectors[0].components[1].length, 0);
});

QUnit.test("Piece.Create creates a piece", function (assert) {
	const json = {move: "(1, 0)d", capture: "(0, 1)d", moveCapture: "(1, 1)d", identifier: "a", player: "b"};
	const piece = Piece.Create(json);
	assert.deepEqual(piece.moveVectors.length, 1);
	assert.deepEqual(piece.moveVectors[0].components[0].length, 1);
	assert.deepEqual(piece.moveVectors[0].components[1].length, 0);
	assert.deepEqual(piece.captureVectors.length, 1);
	assert.deepEqual(piece.captureVectors[0].components[0].length, 0);
	assert.deepEqual(piece.captureVectors[0].components[1].length, 1);
	assert.deepEqual(piece.moveCaptureVectors.length, 1);
	assert.deepEqual(piece.moveCaptureVectors[0].components[0].length, 1);
	assert.deepEqual(piece.moveCaptureVectors[0].components[1].length, 1);
	assert.deepEqual(piece.identifier, "a");
	assert.deepEqual(piece.player, "b");
});
