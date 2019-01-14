QUnit.test("Component parses notation with a local infinite-repetition flag", function (assert) {
    const expected = [new Component(1, 100, false, false, false), new Component(-1, 100, false, false, false)];
    const actual = Component.Create("1+", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local finite-repetition flag", function (assert) {
    const expected = [new Component(1, 5, false, false, false), new Component(-1, 5, false, false, false)];
    const actual = Component.Create("1{5}", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local jump flag", function (assert) {
    const expected = [new Component(1, 1, true, false, false), new Component(-1, 1, true, false, false)];
    const actual = Component.Create("1j", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local hop flag", function (assert) {
    const expected = [new Component(1, 1, false, true, false), new Component(-1, 1, false, true, false)];
    const actual = Component.Create("1h", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local promote flag", function (assert) {
    const expected = [new Component(1, 1, false, false, true), new Component(-1, 1, false, false, true)];
    const actual = Component.Create("1p", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local directional flag", function (assert) {
    const expected = [new Component(1, 1, false, false, false)];
    const actual = Component.Create("1d", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global infinite-repetition flag", function (assert) {
    const expected = [new Component(1, 100, false, false, false), new Component(-1, 100, false, false, false)];
    const actual = Component.Create("1", "+");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global finite-repetition flag", function (assert) {
    const expected = [new Component(1, 5, false, false, false), new Component(-1, 5, false, false, false)];
    const actual = Component.Create("1", "{5}");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global jump flag", function (assert) {
    const expected = [new Component(1, 1, true, false, false), new Component(-1, 1, true, false, false)];
    const actual = Component.Create("1", "j");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global hop flag", function (assert) {
    const expected = [new Component(1, 1, false, true, false), new Component(-1, 1, false, true, false)];
    const actual = Component.Create("1", "h");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global promote flag", function (assert) {
    const expected = [new Component(1, 1, false, false, true), new Component(-1, 1, false, false, true)];
    const actual = Component.Create("1", "p");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a global directional flag", function (assert) {
    const expected = [new Component(1, 1, false, false, false)];
    const actual = Component.Create("1", "d");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with multiple local flags", function (assert) {
    const expected = [new Component(1, 100, true, false, true), new Component(-1, 100, true, false, true)];
    const actual = Component.Create("1+jp", "");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with multiple global flags", function (assert) {
    const expected = [new Component(1, 5, false, true, true)];
    const actual = Component.Create("1", "{5}hpd");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with multiple distinct local and global flags", function (assert) {
    const expected = [new Component(1, 100, false, true, true)];
    const actual = Component.Create("1pd", "+h");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with multiple duplicate local and global flags", function (assert) {
    const expected = [new Component(1, 1, false, true, true)];
    const actual = Component.Create("1hphp", "hhphphphhd");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local infinite-repetition flag and a global finite-repetition flag", function (assert) {
    const expected = [new Component(1, 100, false, false, false), new Component(-1, 100, false, false, false)];
    const actual = Component.Create("1+", "{9}");
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with a local finite-repetition flag and a global infinite-repetition flag", function (assert) {
    const expected = [new Component(1, 2, false, false, false), new Component(-1, 2, false, false, false)];
    const actual = Component.Create("1{2}", "+");
    assert.deepEqual(actual, expected);
});