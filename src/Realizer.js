/* Manages the display of the board to the user */
class Realizer  {
    constructor(game) {
        this.game = game;
        this.board = game.board;

        this.activeCell = undefined;
        this.activeCellCanMove = [];
        this.activeCellCanCapture = [];
        this.activeCellCanMoveCapture = [];
    }

    /**
     * Method to be called by the front-end. Incurs computational
     * cost each time called. Outputs the current state of the board.
     */
    Realize() {
        let outputArea = document.getElementById("output");
        if (outputArea.firstChild) {
            outputArea.removeChild(outputArea.firstChild);
        }
        outputArea.appendChild(this.CreateDisplayBoard());
    }

    ProcessClick(clickedCell) {
        if (this.activeCell === undefined) {
            this.SetActiveCell(clickedCell);
            return;
        }
        if (clickedCell === this.activeCell) {
            this.SetActiveCell(undefined);
            return;
        }
        if (this.activeCellCanMoveCapture.includes(clickedCell)) {
            this.CreateAndProcessMove(true, true, this.activeCell, clickedCell);
            return;
        }
        if (this.activeCellCanCapture.includes(clickedCell)) {
            this.CreateAndProcessMove(false, true, this.activeCell, clickedCell);
            return;
        }
        if (this.activeCellCanMove.includes(clickedCell)) {
            this.CreateAndProcessMove(true, false, this.activeCell, clickedCell);
            return;
        }

        /* They just clicked another cell, not a viable action */
        this.SetActiveCell(clickedCell);
    }

    SetActiveCell(newActiveCell) {
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

    CreateAndProcessMove(move, capture, source, target) {
        const moveObj = new Move(move, capture, source, target, this.board.contents[target]);

        this.game.Step(moveObj, true, this);
        this.activeCell = undefined;
        this.Realize();
    }

    CreateDisplayBoard() {
        let toDisplay = this.board.ConvertToArray();
        let dimensionLengths = MatrixUtilities.GetLengths(toDisplay);
        let dimensionCount = dimensionLengths.length;

        let countOddDimensions = dimensionLengths.reduce((count, current) => {
            return count + (current % 2 === 0) ? 0 : 1;
        }, 0);
        let tricoloring = dimensionLengths.length == 2 && toDisplay[0].length != toDisplay[1].length;

        const board = this.AssembleChild(toDisplay, dimensionCount, countOddDimensions % 2, tricoloring);

        return board;
    }

    AssembleChild(matrix, dimensions, offsetColoring, tricoloring = false) {
        if (dimensions === 0) {
            /* It's a single cell; make it and return */
            const cellIndex = matrix; /* Rename for clarity */

            const cell = document.createElement("div");
            cell.className = `cell${cellIndex < 0 ? " oob" : ""}`;
            let contents = "&nbsp";
            const backgroundColor = this.DetermineBackgroundColor(cellIndex, offsetColoring, tricoloring);
            const foregroundColor = this.DetermineForegroundColor(cellIndex, offsetColoring, tricoloring);

            if (this.board.contents[cellIndex] !== undefined) {
                contents = this.board.contents[cellIndex].identifier;
            }

            cell.style.backgroundColor = backgroundColor;
            cell.style.color = foregroundColor;

            const size = "35px"; //TODO: Make this dynamic #55
            cell.style.width = size;
            cell.style.height = size;

            cell.innerHTML = `${cellIndex}<br />${contents}`;
            cell.onclick = () => { processClick(event, cellIndex); };

            return cell;
        }

        let aggregateElement = document.createElement("div");
        aggregateElement.className = ((dimensions % 2 === 0) ? "vdimension" : "hdimension");
        aggregateElement.style.margin = (10 * Math.floor(dimensions / 2)) + "px";
        for (let i = 0; i < matrix.length; i++) {
            if (dimensions == 1 && tricoloring) {
                aggregateElement.appendChild(
                    this.AssembleChild(matrix[i],
                    dimensions - 1,
                    (offsetColoring ? i + 1 : i) % 3,
                    tricoloring)
                );
            } else {
                aggregateElement.appendChild(
                    this.AssembleChild(matrix[i],
                    dimensions - 1,
                    (matrix[i].length % 2 === 0 && i % 2 === 0) ? 1 - offsetColoring : offsetColoring,
                    tricoloring)
                );
            }
        }

        return aggregateElement;
    }

    DetermineBackgroundColor(index, offsetColor, tricoloring = false) {
        if (index < 0) {
            return "#FFFFFF";
        }

        let colorIndex = offsetColor ? (index + 1) : (index);
        let bgColor = (colorIndex % 2 === 0) ? "#000000" : "#FFFFFF";

        if (tricoloring) {
            if (offsetColor == 0) bgColor = "#B2B29F";
            if (offsetColor == 1) bgColor = "#B29FB2";
            if (offsetColor == 2) bgColor = "#9FB2B2";
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

    DetermineForegroundColor(index, offsetColor, tricoloring = false) {
        if (index < 0) {
            return "#FFFFFF";
        }

        let colorIndex = offsetColor ? index + 1 : index;
        let fgColor = (colorIndex % 2 === 0) ? "#FFFFFF" : "#000000";

        if (tricoloring) {
            if (offsetColor == 0) fgColor = "#000000";
            if (offsetColor == 1) fgColor = "#000000";
            if (offsetColor == 2) fgColor = "#000000";
        }

        if (this.board.contents[index] !== undefined && this.board.contents[index].player.color !== undefined) {
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
