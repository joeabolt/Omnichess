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

    static goesOverEdge(direction, axis, start, boardLengths) {
        const directionVector = BoardGenerator.splitDirectionIntoVector(direction, boardLengths);

        const subBoardLength = ArrayUtilities.ProductOfLastN(boardLengths, axis);
        const positionOnAxis = Math.floor((start-1) / subBoardLength) % boardLengths[axis];

        if (positionOnAxis === 0 && directionVector[axis] === -1) {
            return true; // Go over the "negative" edge for this axis
        }
        if (positionOnAxis === boardLengths[axis] - 1 && directionVector[axis] === 1) {
            return true; // Go over the "positive" edge for this axis
        }

        return false;
    }

    // 3, 0, [8,8], [false, true]
    static getCellInDirection(direction, start, boardLengths, wrappingByDimension) {
        let totalOffset = 0;

        // Convert to a vector of -1, 0, or 1
        // [-1, 0]
        const directionVector = BoardGenerator.splitDirectionIntoVector(direction, boardLengths);

        // For each axis, add or subtract the length of the sub-board for that axis.
        // If wrapping and on edge, do the opposite (subtract or add) for the length of the current board.
        for (let axis = 0; axis < directionVector.length; axis++) {
            // increment = 1
            const increment = ArrayUtilities.ProductOfLastN(boardLengths, axis);
            // totalOffset = -1
            totalOffset += directionVector[axis] * increment;

            if (BoardGenerator.goesOverEdge(direction, axis, start, boardLengths)) {
                if (wrappingByDimension[axis]) {
                    const subBoardSize = ArrayUtilities.ProductOfLastN(boardLengths, axis + 1);
                    const correction = -1 * directionVector[axis] * subBoardSize;
                    totalOffset += correction;
                } else {
                    return null;
                }
            }
        }
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