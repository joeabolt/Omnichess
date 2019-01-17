QUnit.test("Piece constructor makes an empty piece", function (assert) {
	const piece = new Piece();
	assert.deepEqual(piece.moveVectors, []);
	assert.deepEqual(piece.captureVectors, []);
	assert.deepEqual(piece.moveCaptureVectors, []);
	assert.deepEqual(piece.identifier, "");
	assert.deepEqual(piece.player, undefined);
});