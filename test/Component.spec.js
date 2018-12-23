// NOTE: This does not test for local and global finite repetition flags
for (let i = 0; i < 256; i++) {
    // Treats i, conceptually, like a binary number and sets each bit to a boolean flag
    const localInfinite =   Math.floor(i / 128) % 2 === 1
    const localJump =       Math.floor(i / 64) % 2 === 1;
    const localHop =        Math.floor(i / 32) % 2 === 1;
    const localPromote =    Math.floor(i / 16) % 2 === 1;
    const globalInfinite =  Math.floor(i / 8) % 2 === 1;
    const globalJump =      Math.floor(i / 4) % 2 === 1;
    const globalHop =       Math.floor(i / 2) % 2 === 1;
    const globalPromote =   Math.floor(i / 1) % 2 === 1;

    // Append comma-delimited descriptors to the test title based on what flags are enabled
    const descriptors = [];
    if (i === 0) descriptors.push("no flags");
    else {
        if (localInfinite && globalInfinite) descriptors.push("local and global infinite repetition flags");
        else if (localInfinite) descriptors.push("local infinite repetition flag");
        else if (globalInfinite) descriptors.push("global infinite repetition flag");

        if (localJump && globalJump) descriptors.push("local and global jump flags");
        else if (localJump) descriptors.push("local jump flag");
        else if (globalJump) descriptors.push("global jump flag");

        if (localHop && globalHop) descriptors.push("local and global hop flags");
        else if (localHop) descriptors.push("local hop flag");
        else if (globalHop) descriptors.push("global hop flag");

        if (localPromote && globalPromote) descriptors.push("local and global promote flags");
        else if (localPromote) descriptors.push("local promote flag");
        else if (globalPromote) descriptors.push("global promote flag");
    }

    // Begin unit test
    QUnit.test(`Component parses notation with ${descriptors.join(", ")}`, function (assert) {
        // Arrange
        const componentString = `1${localInfinite ? "+" : ""}${localJump ? "j" : ""}${localHop ? "h" : ""}${localPromote ? "p" : ""}`;
        const globalString = `(${componentString}, 0)${globalInfinite ? "+" : ""}${globalJump ? "j" : ""}${globalHop ? "h" : ""}${globalPromote ? "p" : ""}`;
        const expected = [
            new Component(1, localInfinite || globalInfinite ? 100 : 1, localJump || globalJump, localHop || globalHop, localPromote || globalPromote),
            new Component(-1, localInfinite || globalInfinite ? 100 : 1, localJump || globalJump, localHop || globalHop, localPromote || globalPromote),
        ];

        // Act
        const actual = Component.Create(componentString, globalString);

        // Assert
        assert.deepEqual(actual, expected);
    });
}