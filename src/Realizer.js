/* Manages the display of the board to the user */
class Realizer  {
    constructor(board) {
        this.board = board;

        this.activeCell = undefined;
        this.activeCellCanMove = [];
        this.activeCellCanCapture = [];
        this.activeCellCanMoveCapture = [];

        this.allPictures = true;
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
            this.tentativeMove(this.activeCell, clickedCell);
            this.setActiveCell(undefined);
        } else if (this.activeCellCanCapture.includes(clickedCell)) {
            move = this.createMove(false, true, this.activeCell, clickedCell);
            this.tentativeMove(this.activeCell, clickedCell);
            this.setActiveCell(undefined);
        } else if (this.activeCellCanMove.includes(clickedCell)) {
            move = this.createMove(true, false, this.activeCell, clickedCell);
            this.tentativeMove(this.activeCell, clickedCell);
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

        if (this.activeCell !== undefined && this.board.contents[this.activeCell] !== undefined) {
            const activePiece = this.board.contents[this.activeCell];
            this.activeCellCanMove = activePiece.moveLocations;
            this.activeCellCanCapture = activePiece.captureLocations;
            this.activeCellCanMoveCapture = activePiece.moveCaptureLocations;
        }
    }

    createMove(move, capture, source, target) {
        const moveObj = new Move(move, capture, source, target, this.board.contents[target]);
        return moveObj;
    }

    tentativeMove(source, target) {
        this.board.contents[target] = this.board.contents[source];
        this.board.contents[source] = undefined;
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

        const board = this.assembleChild(toDisplay, dimensionCount, countOddDimensions % 2, tricoloring, verticalHex, 0);

        return board;
    }

    assembleChild(matrix, dimensions, offsetColoring, tricoloring = false, verticalHex = false, index = -1) {
        if (dimensions === 0) {
            /* It's a single cell; make it and return */
            const cellIndex = matrix; /* Rename for clarity */

            const cell = document.createElement("div");
            cell.className = `cell${cellIndex < 0 ? " oob" : ""}`;
            let contents = "&nbsp";
            const backgroundColor = this.determineBackgroundColor(cellIndex, offsetColoring, tricoloring);
            const foregroundColor = this.determineForegroundColor(cellIndex, offsetColoring, tricoloring);

            if (this.board.contents[cellIndex] != undefined) {
                if (this.board.contents[cellIndex].image) {
                    cell.style.background = `url('${this.board.contents[cellIndex].image}') 50% 50%, ${backgroundColor}`;
                    cell.style.backgroundSize = 'contain';
                } else {
                    contents = this.board.contents[cellIndex].identifier;
                    this.allPictures = false;
                    cell.style.backgroundColor = backgroundColor;
                }
            } else {
                cell.style.backgroundColor = backgroundColor;
            }

            cell.style.backgroundColor = backgroundColor;
            cell.style.color = foregroundColor;

            const size = "37px"; //TODO: Make this dynamic #55
            cell.style.width = size;
            cell.style.height = size;
            if (tricoloring) {
                if (verticalHex) {
                    cell.style.width = "42px";
                    cell.className = cell.className + " vhex"
                } else {
                    cell.style.height = "42px";
                    cell.className = cell.className + " hhex"
                }
            }

            if (!this.allPictures) cell.innerHTML = `${cellIndex}<br />${contents}`;
            cell.onclick = () => { processClick(event, cellIndex); };

            return cell;
        }

        let aggregateElement = document.createElement("div");
        aggregateElement.className = ((dimensions % 2 === 0 ^ verticalHex) ? "vdimension" : "hdimension");
        let marginSize = 10 * Math.floor(dimensions/2);
        if (dimensions === 1 && tricoloring) {
            if (verticalHex) {
                aggregateElement.style.margin = `${marginSize}px -6px`;
            } else {
                aggregateElement.style.margin = `-6px ${marginSize}px`;
            }
        } else {
            aggregateElement.style.margin = `${marginSize}px`;
        }
        if (dimensions == 1 && tricoloring && !verticalHex && index % 2 == 1) {
            // I'm a horizontal hex row and I need to add a hexpad div at my start
            const hexpad = document.createElement("div");
            hexpad.className = "hexpad";
            aggregateElement.appendChild(hexpad);
        }
        for (let i = 0; i < matrix.length; i++) {
            if (dimensions == 1 && tricoloring) {
                aggregateElement.appendChild(
                    this.assembleChild(matrix[i],
                    dimensions - 1,
                    (offsetColoring ? i + 1 : i) % 3,
                    tricoloring, verticalHex, i)
                );
            } else {
                aggregateElement.appendChild(
                    this.assembleChild(matrix[i],
                    dimensions - 1,
                    (dimensions > 1 && i % 2 === 0) ? 1 - offsetColoring : offsetColoring,
                    tricoloring, verticalHex, i)
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
        let bgColor = (colorIndex % 2 === 0) ? "#DDDDDD" : "#444444";

        if (tricoloring) {
            if (offsetColor == 0) bgColor = "#CCCCCC";
            if (offsetColor == 1) bgColor = "#444444";
            if (offsetColor == 2) bgColor = "#888888";
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
        let fgColor = (colorIndex % 2 === 0) ? "#000000" : "#FFFFFF";

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
}
