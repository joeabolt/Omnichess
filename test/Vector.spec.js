QUnit.test("Vector parses notation with a single element", function (assert)
{
    const unit = new Component(1, 1, false, false, false);
    const inverse = new Component(-1, 1, false, false, false);
    const expected = [new Vector([unit, unit]), new Vector([unit, inverse]), new Vector([inverse, unit]), new Vector([inverse, inverse])];
    const actual = Vector.Create("(1, 1)");
    assert.deepEqual(actual, expected);
});

QUnit.test("Vector parses notation with a single element and ignores semicolons", function (assert)
{
    const unit = new Component(1, 1, false, false, false);
    const inverse = new Component(-1, 1, false, false, false);
    const expected = [new Vector([unit, unit]), new Vector([unit, inverse]), new Vector([inverse, unit]), new Vector([inverse, inverse])];
    const actual = Vector.Create("(1, 1);;;;;;;;");
    assert.deepEqual(actual, expected);
});

QUnit.test("Vector parses notation with two elements", function (assert)
{
    const zero = new Component(0, 1, false, false, false);
    const unit = new Component(1, 1, false, false, false);
    const inverse = new Component(-1, 1, false, false, false);
		
    const expected = [new Vector([unit, unit]), new Vector([unit, inverse]), new Vector([inverse, unit]), new Vector([inverse, inverse]),
		new Vector([zero, unit]), new Vector([zero, inverse])];
    const actual = Vector.Create("(1, 1);(0, 1)");
    assert.deepEqual(actual, expected);
});

QUnit.test("Vector parses notation regardless of whitespace", function (assert)
{
    const unit = new Component(1, 1, false, false, false);
    const inverse = new Component(-1, 1, false, false, false);
    const expected = [new Vector([unit, unit]), new Vector([unit, inverse]), new Vector([inverse, unit]), new Vector([inverse, inverse])];
    const actual = Vector.Create("  (    1,1 )      ;     ");
    assert.deepEqual(actual, expected);
});
