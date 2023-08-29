/* Manages the display of the board to the user */
class Realizer  {
    constructor(board) {
        this.board = board;

        this.activeCell = undefined;
        this.activeCellCanMove = [];
        this.activeCellCanCapture = [];
        this.activeCellCanMoveCapture = [];
    }

    /**
     * Method to be called by the front-end. Incurs computational
     * cost each time called. Outputs the current state of the board.
     */
    realize() {
        let outputArea = document.getElementById("output");
        if (outputArea.firstChild) {
            outputArea.removeChild(outputArea.firstChild);
        }
        outputArea.appendChild(this.createDisplayBoard());
    }

    setLog(log) {
        if (log == undefined || log.length == 0) {
            document.getElementById("message").innerHTML = "";
        } else {
            const reversed = [];
            while (log.length > 0) reversed.push(log.pop());
            document.getElementById("message").innerHTML = reversed.join("<br />");
        }
    }

    processClick(clickedCell) {
        let move = null;
        if (this.activeCell === undefined) {
            this.setActiveCell(clickedCell);
        } else if (clickedCell === this.activeCell) {
            this.setActiveCell(undefined);
        } else if (this.activeCellCanMoveCapture.includes(clickedCell)) {
            move = this.createMove(true, true, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
        } else if (this.activeCellCanCapture.includes(clickedCell)) {
            move = this.createMove(false, true, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
        } else if (this.activeCellCanMove.includes(clickedCell)) {
            move = this.createMove(true, false, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
        } else {
            /* They just clicked another cell, not a viable action */
            this.setActiveCell(clickedCell);
        }

        this.realize();
        return move;
    }

    setActiveCell(newActiveCell) {
        this.activeCell = newActiveCell;
        this.activeCellCanMove = [];
        this.activeCellCanCapture = [];
        this.activeCellCanMoveCapture = [];
        
        let toDisplay = this.board.array;
        let dimensionLengths = MatrixUtilities.GetLengths(toDisplay);
        let tricoloring = dimensionLengths.length == 2 && toDisplay[0].length != toDisplay[1].length;
        const getCellsFunction = (a, b, c, d) => {
            return tricoloring ? this.HexGetCellIndices(a, b, c, d) : this.SquareGetCellIndices(a, b, c, d);
        };

        if (this.activeCell !== undefined && this.board.contents[this.activeCell] !== undefined) {
            const activePiece = this.board.contents[this.activeCell];

            activePiece.moveVectors.forEach((vector) => {
                this.activeCellCanMove.push(...getCellsFunction(vector, this.activeCell, false));
            });
            this.activeCellCanMove = [...new Set(this.activeCellCanMove)];

            activePiece.captureVectors.forEach((vector) => {
                this.activeCellCanCapture.push(...getCellsFunction(vector, this.activeCell, true, true));
            });
            this.activeCellCanCapture = [...new Set(this.activeCellCanCapture)];

            activePiece.moveCaptureVectors.forEach((vector) => {
                this.activeCellCanMoveCapture.push(...getCellsFunction(vector, this.activeCell, true, true));
            });
            this.activeCellCanMoveCapture = [...new Set(this.activeCellCanMoveCapture)];
        }
    }

    createMove(move, capture, source, target) {
        const moveObj = new Move(move, capture, source, target, this.board.contents[target]);
        return moveObj;
    }

    createDisplayBoard() {
        let toDisplay = this.board.array;
        let dimensionLengths = MatrixUtilities.GetLengths(toDisplay);
        let dimensionCount = dimensionLengths.length;

        let countOddDimensions = dimensionLengths.reduce((count, current) => {
            return count + (current % 2 === 0) ? 0 : 1;
        }, 0);
        let tricoloring = dimensionLengths.length == 2 && toDisplay[0].length != toDisplay[1].length;
        let verticalHex = tricoloring && this.board.orientation == "vertical";

        const board = this.assembleChild(toDisplay, dimensionCount, countOddDimensions % 2, tricoloring, verticalHex);

        return board;
    }

    assembleChild(matrix, dimensions, offsetColoring, tricoloring = false, verticalHex = false) {
        if (dimensions === 0) {
            /* It's a single cell; make it and return */
            const cellIndex = matrix; /* Rename for clarity */

            const cell = document.createElement("div");
            cell.className = `cell${cellIndex < 0 ? " oob" : ""}`;
            let contents = "&nbsp";
            const backgroundColor = this.determineBackgroundColor(cellIndex, offsetColoring, tricoloring);
            const foregroundColor = this.determineForegroundColor(cellIndex, offsetColoring, tricoloring);

            if (this.board.contents[cellIndex] != undefined) {
                contents = this.board.contents[cellIndex].identifier;
            }

            cell.style.backgroundColor = backgroundColor;
            cell.style.color = foregroundColor;

            const size = "37px"; //TODO: Make this dynamic #55
            cell.style.width = size;
            cell.style.height = size;
            if (tricoloring) {
                if (verticalHex) {
                    cell.style.height = "42px";
                } else {
                    cell.style.width = "42px";
                }
            }

            cell.innerHTML = `${cellIndex}<br />${contents}`;
            cell.onclick = () => { processClick(event, cellIndex); };

            return cell;
        }

        let aggregateElement = document.createElement("div");
        aggregateElement.className = ((dimensions % 2 === 0 ^ verticalHex) ? "vdimension" : "hdimension");
        aggregateElement.style.margin = (10 * Math.floor(dimensions / 2)) + "px";
        for (let i = 0; i < matrix.length; i++) {
            if (dimensions == 1 && tricoloring) {
                aggregateElement.appendChild(
                    this.assembleChild(matrix[i],
                    dimensions - 1,
                    (offsetColoring ? i + 1 : i) % 3,
                    tricoloring, verticalHex)
                );
            } else {
                aggregateElement.appendChild(
                    this.assembleChild(matrix[i],
                    dimensions - 1,
                    (matrix[i].length % 2 === 0 && i % 2 === 0) ? 1 - offsetColoring : offsetColoring,
                    tricoloring, verticalHex)
                );
            }
        }

        return aggregateElement;
    }

    determineBackgroundColor(index, offsetColor, tricoloring = false) {
        if (index < 0) {
            return "#FFFFFF";
        }

        let colorIndex = offsetColor ? (index + 1) : (index);
        let bgColor = (colorIndex % 2 === 0) ? "#000000" : "#FFFFFF";

        if (tricoloring) {
            if (offsetColor == 0) bgColor = "#666666";
            if (offsetColor == 1) bgColor = "#000000";
            if (offsetColor == 2) bgColor = "#333333";
        }

        if (this.activeCell !== undefined) {
            if (this.activeCell === index) {
                bgColor = "#00FF00";
            }
            if (this.activeCellCanMove.includes(index)) {
                bgColor = "#0000FF";
            }
            if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index)) {
                bgColor = "#FF0000";
            }
        }

        return bgColor;
    }

    determineForegroundColor(index, offsetColor, tricoloring = false) {
        if (index < 0) {
            return "#FFFFFF";
        }

        let colorIndex = offsetColor ? index + 1 : index;
        let fgColor = (colorIndex % 2 === 0) ? "#FFFFFF" : "#000000";

        if (tricoloring) {
            if (offsetColor == 0) fgColor = "#FFFFFF";
            if (offsetColor == 1) fgColor = "#FFFFFF";
            if (offsetColor == 2) fgColor = "#FFFFFF";
        }

        if (this.board.contents[index] != undefined && this.board.contents[index].color != undefined) {
            fgColor = this.board.contents[index].color;
        }

        if (this.activeCell !== undefined) {
            if (this.activeCell === index) {
                fgColor = "#000000";
            }
            if (this.activeCellCanMove.includes(index)) {
                fgColor = "#FFFFFF";
            }
            if (this.activeCellCanCapture.includes(index) || this.activeCellCanMoveCapture.includes(index)) {
                fgColor = "#000000";
            }
        }

        return fgColor;
    }









    // STOLEN FROM BOARD.JS, IT'S A TEMPORARY SOLUTION, JUST A PHASE, MA
    SquareGetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false) {
        const allCellIndices = new Set();

        const maxRepetitions = vector.components.reduce((maximum, currComp) => {
            return Math.max(maximum, currComp.maxRep);
        }, 1);

        for (let i = 1; i <= maxRepetitions; i++) {
            const output = this.SquareGetPathOutput(startLocation, vector.components, i);

            if (output === null || output <= 0 || 
                (this.board.contents[output] != undefined && !includeCaptureEligible) || 
                (this.board.contents[output] == undefined && enforceCaptureEligible)) {
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
    SquareGetPathOutput(start, components, iterations) {
        let destCell = start;
        let prevCell = start;
        
        /* Track total direction to go along each axis */
        const deltas = [];
        components.forEach((component, index) => {
            deltas.push(component.length * Math.min(iterations, component.maxRep));
        });

        while (deltas.reduce((total, current) => total + Math.abs(current), 0) !== 0) {
            /* Identify +1, -1, or no movement along each axis and convert to direction */
            const steps = deltas.map((element) => Math.sign(element));
            deltas.forEach((delta, index) => {
                deltas[index] -= steps[index];
            });
            const direction = MatrixUtilities.VectorToDirection(steps);

            /* Take the step */
            prevCell = destCell;
            destCell = this.board.cells[destCell - 1][direction];

            /* Do not include OoB */
            if (destCell === null || destCell <= 0) {
                break;
            }

            /* Stop iterating when we hit an occupied square, unless jump or hop */
            if (this.board.contents[destCell] != undefined) {
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
        let hop = false;
        components.forEach((component) => {
            if (component.hop) {
                hop = true;
            }
        });
        if (hop && this.board.contents[prevCell] === undefined) {
            return null;
        }

        return destCell;
    }









    // STOLEN FROM HEXBOARD.JS
    HexGetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false) {
        let verbose = startLocation == 61 && enforceCaptureEligible == true;
        verbose = false;
        const allCellIndices = new Set();

        const maxRepetitions = vector.components.reduce((maximum, currComp) => {
            return Math.max(maximum, currComp.maxRep);
        }, 1);
        // const maxRepetitions = 1;

        for (let i = 1; i <= maxRepetitions; i++) {
            const output = this.HexGetPathOutput(startLocation, vector.components, i, verbose);
            if (verbose) console.log(`Stepping along ${vector.toString()} gave ${output}`);

            if (output === null || output <= 0 || 
                (this.board.contents[output] != undefined && !includeCaptureEligible) || 
                (this.board.contents[output] == undefined && enforceCaptureEligible)) {
                if (verbose) console.log("  Ineligible by capture rules; ignoring");
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
    HexGetPathOutput(start, components, iterations, verbose) {
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
                destCell = this.board.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 0 to " + destCell);
            }
            if (steps[1] != 0 && destCell !== null && destCell > 0) {
                const direction = steps[1] > 0 ? 1 : 4; // Down-right or up-left
                destCell = this.board.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 1 to " + destCell);
            }
            if (steps[2] != 0 && destCell !== null && destCell > 0) {
                const direction = steps[2] > 0 ? 5 : 2; // Up-right or down-left
                destCell = this.board.cells[destCell][direction];
                if (verbose) console.log("Stepped along axis 2 to " + destCell);
            }

            /* Do not include OoB */
            if (destCell == null || destCell <= 0) {
                break;
            }

            /* Stop iterating when we hit an occupied square, unless jump or hop */
            if (this.board.contents[destCell] != undefined) {
                /* Only jump/hop when moving with that component */
                let canHopObstacle = false;
                components.forEach((component, index) => {
                    if ((component.jump || component.hop) && deltas[index] !== 0)
                        canHopObstacle = true;
                });

                if (canHopObstacle) {
                    continue;
                }

                if (deltas.reduce((sum, x) => sum + x, 0) !== 0) {
                    return null;
                } else {
                    break;
                }
            }
        }

        /* If hop, only output when previous cell is occupied */
        const hop = components.reduce((canHop, comp) => canHop || comp.hop, false);
        if (hop && this.board.contents[prevCell] == undefined) {
            return null;
        }

        return destCell;
    }
}
