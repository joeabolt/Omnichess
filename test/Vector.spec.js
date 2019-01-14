QUnit.test("Vector parses notation with a single element", function (assert) {
    const unit = new Component(1, 1, false, false, false);
    const inverse = new Component(-1, 1, false, false, false);
    const expected = [new Vector(unit, unit), new Vector(unit, inverse), new Vector(inverse, unit), new Vector(inverse, inverse)];
    const actual = Vector.Create("(1, 1)");
    assert.deepEqual(actual, expected);
});