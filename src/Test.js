class Test {
    static runAllTests() {
        const allTests = Object.getOwnPropertyNames(Test)
            .filter(prop => typeof Test[prop] === "function");
        const failedTests = [];
        allTests.forEach((testName) => {
            if (testName === "runAllTests") {
                return;
            }
            console.log("Starting test: " + testName);
            if (Test[testName]()) {
                console.log("Passed.");
            } else {
                failedTests.push(testName);
                console.error("Test " + testName + " failed.");
            }
        });
        if (failedTests.length > 0) {
            console.error("The following tests failed: " + failedTests.join(", "));
        } else {
            console.log("All tests passed!");
        }
    }

    static basicArithmetic() {
        const testCases = [["Addition", "2 + 3", "5"], ["Subtraction", "3 - 2", "1"], ["Multiplication", "2 * 3", "6"], ["Division", "3 / 2", "1.5"],
            ["Equality", "2 = 2", "true"], ["Inequality", "2 != 2", "false"], ["Greater Than", "(3 > 2) (3 > 3)", "true false"],
            ["Less Than", "(2 < 3) (2 < 2)", "true false"], ["Greater Than or Equal", "(2 >= 3) (3 >= 3)", "false true"],
            ["Less Than or Equal", "(2 <= 3) (2 <= 2)", "true true"]];

        const engine = new Engine();
        engine.buildContext();

        let errors = 0;
        testCases.forEach((test) => {
            const input = test[1];
            const output = engine.parse(input);
            if (output !== test[2]) {
                console.log("Expected: " + test[2]);
                console.log("Actual: " + output);
                console.error(test[0] + " failed.");
                errors += 1;
            }
        });

        return errors == 0;
    }

    static extraWhitespaceRemoved() {
        const input = "   test    test test     test\ntest";
        const expectedOutput = "test test test test test";

        const engine = new Engine();
        engine.buildContext();

        const actualOutput = engine.parse(input);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }

    static getDefaultPlayerProperties() {
        const input = "get var[0] player";
        const expectedOutput = "1";
        const piece = { location: 3, player: 1 };

        const engine = new Engine();
        engine.buildContext();
        engine.addPiece(piece);

        const actualOutput = engine.parse(input);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }

    static setPlayerProperties() {
        const input = ["set var[0] player 5", "get var[0] player"];
        const expectedOutput = "5";
        const piece = { location: 3, player: 1 };

        const engine = new Engine();
        engine.buildContext();
        engine.addPiece(piece);

        engine.parse(input[0]);
        const actualOutput = engine.parse(input[1]);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }

    static setCustomPlayerProperties() {
        const input = ["set var[0] testProperty 5", "get var[0] testProperty"];
        const expectedOutput = "5";
        const piece = { location: 3, player: 1 };

        const engine = new Engine();
        engine.buildContext();
        engine.addPiece(piece);

        engine.parse(input[0]);
        const actualOutput = engine.parse(input[1]);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }

    static inputLowercased() {
        const input = "Test Whether Capitals become LowerCased";
        const expectedOutput = "test whether capitals become lowercased";

        const engine = new Engine();
        engine.buildContext();

        const actualOutput = engine.parse(input);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }

    static parenthesesRemovedFromFinalOutput() {
        const input = "Test (test (testy mctesterson))";
        const expectedOutput = "test test testy mctesterson";

        const engine = new Engine();
        engine.buildContext();

        const actualOutput = engine.parse(input);
        if (actualOutput !== expectedOutput) {
            console.log("Expected: " + expectedOutput);
            console.log("Actual: " + actualOutput);
            return false;
        }

        return true;
    }
}