const {ArrayUtilities} = require("./ArrayUtilities.js");
const {MatrixUtilities} = require("./MatrixUtilities.js");

class BoardGenerator {
    /**
     * Splits an ordinal direction given board dimensions into a vector with one
     * element per axis. Each element is either -1, 0, or 1.
     */
    static splitDirectionIntoVector(direction, boardLengths) {
        const vector = [];
        for (let axis = 0; axis < boardLengths.length; axis++) {
            const powerOfThree = Math.pow(3, axis);
            const directionOnAxis = Math.floor(direction / powerOfThree) % 3;
            vector.push(directionOnAxis - 1);
        }
        return vector;
    }

    static goesOverEdge(direction, axis, start, boardLengths, verbose = false) {
        const directionVector = BoardGenerator.splitDirectionIntoVector(direction, boardLengths);

        const subBoardLength = ArrayUtilities.ProductOfLastN(boardLengths, axis);
        const lengthOnAxis = boardLengths[boardLengths.length - 1 - axis];
        const positionOnAxis = Math.floor((start-1) / subBoardLength) % lengthOnAxis;

        if (verbose) console.log(`      Edge detection from direction ${directionVector[axis]} and position on axis ${positionOnAxis} given axis length ${lengthOnAxis}.`);
        if (positionOnAxis === 0 && directionVector[axis] === -1) {
            return true; // Go over the "negative" edge for this axis
        }
        if (positionOnAxis === lengthOnAxis - 1 && directionVector[axis] === 1) {
            return true; // Go over the "positive" edge for this axis
        }

        return false;
    }

    // TODO: Something about this seems to have the dimensions reversed?
    // TODO: Some kind of off-by-one where one past the end of the board is still being included and not detected? Maybe edge detection broken?
    // 7, 217, [9,27], [true, true]
    static getCellInDirection(direction, start, boardLengths, wrappingByDimension) {
        let verbose = false;
        let totalOffset = 0;

        // Convert to a vector of -1, 0, or 1
        // [0,1]
        const directionVector = BoardGenerator.splitDirectionIntoVector(direction, boardLengths);
        if (verbose) console.log(`Direction: ${direction}; as vector: ${directionVector} from position ${start} on board ${boardLengths}.`);

        // For each axis, add or subtract the length of the sub-board for that axis.
        // If wrapping and on edge, do the opposite (subtract or add) for the length of the current board.
        for (let axis = 0; axis < directionVector.length; axis++) {
            if (verbose) console.log(`  Processing axis: ${axis} with direction ${directionVector[axis]}`);
            // increment = 1, then 27
            const increment = ArrayUtilities.ProductOfLastN(boardLengths, axis);
            // totalOffset = 27
            totalOffset += directionVector[axis] * increment;
            if (verbose) console.log(`    Increment is ${increment}, so new totalOffset is ${totalOffset}.`);

            if (BoardGenerator.goesOverEdge(direction, axis, start, boardLengths, verbose)) {
                if (verbose) console.log("    This axis takes us over an edge.");
                if (wrappingByDimension[axis]) {
                    const subBoardSize = ArrayUtilities.ProductOfLastN(boardLengths, axis + 1);
                    const correction = -1 * directionVector[axis] * subBoardSize;
                    totalOffset += correction;
                    if (verbose) console.log(`    Wrapping - subboard is ${subBoardSize}, so correction is ${correction} and totalOffset is now ${totalOffset}.`);
                } else {
                    if (verbose) console.log(`Not wrapping - setting to null`);
                    return null;
                }
            }
        }
        if (verbose) console.log(`Returning calculated neighbor: ${start + totalOffset}`);
        return start + totalOffset;
    }

    static Generate(dimensions, oob = [], wrapping = []) {
        const adjacencyMatrix = [];
        const cellCount = ArrayUtilities.ProductOfLastN(dimensions, dimensions.length);
        const directions = Math.pow(3, dimensions.length);

        if (wrapping.length != dimensions.length) {
            wrapping = dimensions.map(_ => false);
        }
        wrapping = wrapping.reverse();
        for (let i = 0; i < cellCount; i++) {
            const neighbors = [];
            for (let d = 0; d < directions; d++) {
                let neighbor = BoardGenerator.getCellInDirection(d, i+1, dimensions, wrapping);
                if (oob.includes(neighbor)) neighbor *= -1;
                neighbors.push(neighbor);
            }
            adjacencyMatrix.push(neighbors);
        }

        return adjacencyMatrix;
    }
}

module.exports.BoardGenerator = BoardGenerator;