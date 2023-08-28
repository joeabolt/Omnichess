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

    processClick(clickedCell) {
        if (this.activeCell === undefined) {
            this.setActiveCell(clickedCell);
            return null;
        }
        if (clickedCell === this.activeCell) {
            this.setActiveCell(undefined);
            return null;
        }

        if (this.activeCellCanMoveCapture.includes(clickedCell)) {
            const move = this.createMove(true, true, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
            return move;
        }
        if (this.activeCellCanCapture.includes(clickedCell)) {
            const move = this.createMove(false, true, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
            return move;
        }
        if (this.activeCellCanMove.includes(clickedCell)) {
            const move = this.createMove(true, false, this.activeCell, clickedCell);
            this.setActiveCell(undefined);
            return move;
        }

        /* They just clicked another cell, not a viable action */
        this.setActiveCell(clickedCell);
    }

    setActiveCell(newActiveCell) {
        this.activeCell = newActiveCell;
        this.activeCellCanMove = [];
        this.activeCellCanCapture = [];
        this.activeCellCanMoveCapture = [];

        if (this.activeCell !== undefined && this.board.contents[this.activeCell] !== undefined) {
            const activePiece = this.board.contents[this.activeCell];

            activePiece.moveVectors.forEach((vector) => {
                this.activeCellCanMove.push(...this.board.GetCellIndices(vector, this.activeCell, false));
            });
            this.activeCellCanMove = [...new Set(this.activeCellCanMove)];

            activePiece.captureVectors.forEach((vector) => {
                this.activeCellCanCapture.push(...this.board.GetCellIndices(vector, this.activeCell, true, true));
            });
            this.activeCellCanCapture = [...new Set(this.activeCellCanCapture)];

            activePiece.moveCaptureVectors.forEach((vector) => {
                this.activeCellCanMoveCapture.push(...this.board.GetCellIndices(vector, this.activeCell, true, true));
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

        if (this.board.contents[index] != undefined && this.board.contents[index].player.color != undefined) {
            fgColor = this.board.contents[index].player.color;
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
}
