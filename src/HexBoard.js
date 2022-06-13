/* Represents the board state at a point in time for a hexagonal board */

/*
 * NOTES FOR HEX CHESS DIFFERENCES
 *
 * Expect adjacency matrix to have 1 subarray for each cell, 6 options
 * For horizontal, they start with due right and go counter-clockwise (like the unit circle)
 * Vectors always have three lengths (for horizontal, this is l/r, dr/ul, ur/dl for -1/+1) (right is always +)
 * 
 * Non-planar boards are _strongly_ discouraged, since "diagonals" and other multi-step movements may become nonsensical
 */

class HexBoard  {
    constructor(adjacencyMatrix) {
        this.cells = adjacencyMatrix;
        this.contents = [];

        /* Has an extra cell (0), but will never be used, and makes stuff line up */
        for (let i = 0; i <= this.cells.length; i++) {
            this.contents.push(undefined);
        }

        this.array = this.ConvertToArray();

        // Calculated once, used to estimate piece value if not explicitly set
        // It is the valid location with the most mobility (based on each cell "voting" on its neighbors, with vote strength = # neighbors)
        this.sink = -1;
        this.source = -1;
        let maxLength = Math.ceil(Math.sqrt(this.cells.length)); // Approximately correct; good enough for this purpose
        let cellValues = this.cells.map(neighbors => neighbors.filter(x => x != null).reduce((sum) => sum + 1, 0));
        for (let i = 0; i < maxLength / 2; i++) {
            // Update everyone with the sum of their neighbors
            let nextCellValues = cellValues.map((strength, index) => {
                return this.cells[index].filter(x => x != null)
                    .map(neighbor => cellValues[neighbor - 1])
                    .reduce((sum, curr) => sum + curr, 0) - strength;
            });
            cellValues = nextCellValues;
        }
        this.sink = cellValues.reduce((strongest, current, index) => cellValues[strongest] > current ? strongest : index, 1);
        this.source = cellValues.reduce((weakest, current, index) => cellValues[weakest] < current ? weakest : index, 1);
    }

    /**
     *  Returns a Set of all locations (as indices) described
     *  by the vector relative to startLocation. Will not continue
     *  down blocked paths, but will include an occupied cell if
     *  includeCaptureEligible is true (defaults to false). If
     *  enforceCaptureEligible is true (defaults to false), only such
     *  cells will be returned.
     *  
     *  Always returns an array. Returns an empty array if no
     *  locations can be found.
     */
    GetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false) {
        let verbose = startLocation == 64 && enforceCaptureEligible == false;
        verbose = false;
        const allCellIndices = new Set();

        const maxRepetitions = vector.components.reduce((maximum, currComp) => {
            return Math.max(maximum, currComp.maxRep);
        }, 1);
        // const maxRepetitions = 1;

        for (let i = 1; i <= maxRepetitions; i++) {
            const output = this.GetPathOutput(startLocation, vector.components, i, verbose);
            if (verbose) console.log(`Stepping along ${vector.toString()} gave ${output}`);

            if (output === null || output <= 0 || 
                (this.contents[output] !== undefined && !includeCaptureEligible) || 
                (this.contents[output] === undefined && enforceCaptureEligible)) {
                continue;
            }
            allCellIndices.add(output);
        }

        /* Convert set to array */
        return [...allCellIndices];
    }

    /**
     *  Returns the index of the cell found by following
     *  the components for the passed number of iterations.
     *  Returns null if it goes off the board, or cannot find
     *  a valid path (such as being obstructed).
     */
    GetPathOutput(start, components, iterations, verbose) {
        let destCell = start;
        let prevCell = start;
        
        /* Track total direction to go along each axis */
        const deltas = [];
        components.forEach((component, index) => {
            deltas.push(component.length * Math.min(iterations, component.maxRep));
        });

        // If more than 2 directions are specified, error (not strictly necessary, but good for sanity)
        const directions = deltas.reduce((nonZeroCount, curr) => nonZeroCount + curr != 0 ? 1 : 0, 0);
        if (directions > 2) {
            return null;
        }

        while (deltas.reduce((total, current) => total + Math.abs(current), 0) !== 0) {
            // Get direction from steps
            const steps = deltas.map((element) => Math.sign(element));
            deltas.forEach((delta, index) => {
                deltas[index] -= steps[index];
            });

            /* Take the step */
            prevCell = destCell;
            if (steps[0] != 0) {
                const direction = steps[0] > 0 ? 0 : 3; // Right or left
                destCell = this.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 0 to " + destCell);
            }
            if (steps[1] != 0 && destCell !== null && destCell > 0) {
                const direction = steps[1] > 0 ? 1 : 4; // Down-right or up-left
                destCell = this.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 1 to " + destCell);
            }
            if (steps[2] != 0 && destCell !== null && destCell > 0) {
                const direction = steps[2] > 0 ? 5 : 2; // Up-right or down-left
                destCell = this.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 2 to " + destCell);
            }

            /* Do not include OoB */
            if (destCell === null || destCell <= 0) {
                break;
            }

            /* Stop iterating when we hit an occupied square, unless jump or hop */
            if (this.contents[destCell] !== undefined) {
                /* Only jump/hop when moving with that component */
                let canHopObstacle = false;
                components.forEach((component, index) => {
                    if ((component.jump || component.hop) && deltas[index] !== 0)
                        canHopObstacle = true;
                });

                if (canHopObstacle) {
                    continue;
                }
                break;
            }
        }

        /* If hop, only output when previous cell is occupied */
        const hop = components.reduce((canHop, comp) => canHop || comp.hop, false);
        if (hop && this.contents[prevCell] === undefined) {
            return null;
        }

        return destCell;
    }

    /**
     * Produces a matrix. Each cell represents a visible slot on the board.
     * Where these cells are not included in the board, they contain negative values. Otherwise, 
     * they contain the index of the cell they represent.
     */
    ConvertToArray() {
        if (this.array) {
            return this.array;
        }
        if (this.cells.length === 0) {
            return MatrixUtilities.GetEmptyMatrix(this.dimensions);
        }

        const outputBoard = [];
        let row = [];
        for (let i = 1; i < this.cells.length; i++) {
            // Check if I'm in-bounds by asking a neighbor
            let inBounds = true;
            if (this.cells[i][0]) {
                inBounds = this.cells[this.cells[i][0]][3] > 0;
            } else if (this.cells[i][3]) {
                inBounds = this.cells[this.cells[i][3]][0] > 0;
            }
            row.push(inBounds ? i : -i);
            if (this.cells[i][0] === null) {
                outputBoard.push(row);
                row = [];
            }
        }

        return outputBoard;
    }

    /**
     * Generates and returns an adjacency matrix. Orientation must be horizontal or vertical and specifies
     * which direction the side-to-side lines go. (Horizontal has a row on top, vertical has a point)
     */
    static Generate(dimensions, orientation) {
        const wideRow = dimensions[0];
        const shortRow = dimensions[0] - 1;
        const rows = dimensions[1];
        const numberOfCells = (rows % 2 == 0) ? 
                (wideRow + shortRow) * rows / 2 : // End on short row
                (wideRow + shortRow) * (Math.floor(rows / 2)) + wideRow; // End on wide row

        // Right (0) is +1 if not at end of row
        // Down-right (1) is +wideRow if not at end of wide row or bottom
        // Down-left (2) is +shortRow if not at start of wide row or bottom
        // Left (3) is -1 if not at end of row
        // Up-left (4) is -wideRow is not at start of wide row or top
        // Up-right (5) is -shortRow if not at end of wide row or top

        const adjacencyMatrix = [];
        for (let i = 0; i <= numberOfCells; i++) {
            const top = i <= wideRow;
            const bottom = (numberOfCells - i) < (rows % 2 == 0 ? shortRow : wideRow);
            const posInCycle = i % (wideRow + shortRow);
            const inWideRow = posInCycle != 0 && posInCycle <= wideRow;
            const startRow = posInCycle === 1 || posInCycle === wideRow + 1;
            const endRow = posInCycle === 0 || posInCycle === wideRow;

            const moves = [];
            moves.push(endRow ? null : i + 1);
            moves.push((inWideRow && endRow) || bottom ? null : i + wideRow);
            moves.push((inWideRow && startRow) || bottom ? null : i + shortRow);
            moves.push(startRow ? null : i - 1);
            moves.push((inWideRow && startRow) || top ? null : i - wideRow);
            moves.push((inWideRow && endRow) || top ? null : i - shortRow);
            adjacencyMatrix.push(moves);
        }

        return adjacencyMatrix;
    }
}
