QUnit.test("Component parses notation with no flags", function (assert) {
    // Arrange
    const expected = [
        new Component(1, 1, false, false, false),
        new Component(-1, 1, false, false, false)
    ];

    // Act
    const actual = Component.Create("1", "(1, 0)");

    // Assert
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with local jump flag", function (assert) {
    // Arrange
    const expected = [
        new Component(1, 1, true, false, false),
        new Component(-1, 1, true, false, false)
    ];

    // Act
    const actual = Component.Create("1j", "(1j, 0)");

    // Assert
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with global jump flag", function (assert) {
    // Arrange
    const expected = [
        new Component(1, 1, true, false, false),
        new Component(-1, 1, true, false, false)
    ];

    // Act
    const actual = Component.Create("1", "(1, 0)j");

    // Assert
    assert.deepEqual(actual, expected);
});

QUnit.test("Component parses notation with local and global jump flag", function (assert) {
    // Arrange
    const expected = [
        new Component(1, 1, true, false, false),
        new Component(-1, 1, true, false, false)
    ];

    // Act
    const actual = Component.Create("1j", "(1j, 0)j");

    // Assert
    assert.deepEqual(actual, expected);
});