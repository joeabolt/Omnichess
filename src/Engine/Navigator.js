class Navigator
{
    constructor(board)
    {
        this.board = board;
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
    GetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false)
    {
        const allCellIndices = new Set();

        const maxRepetitions = vector.components.reduce((maximum, currComp) => {
            return Math.max(maximum, currComp.maxRep);
        }, 1);

        for (let i = 1; i <= maxRepetitions; i++)
        {
            const output = this.GetPathOutput(startLocation, vector.components, i);

            if (output === null || output <= 0 || 
                (this.board.contents[output] !== undefined && !includeCaptureEligible) || 
                (this.board.contents[output] === undefined && enforceCaptureEligible))
            {
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
    GetPathOutput(start, components, iterations)
    {
        let destCell = start;
        let prevCell = start;
        
        /* Track total direction to go along each axis */
        const deltas = [];
        components.forEach((component) => {
            deltas.push(component.length * Math.min(iterations, component.maxRep));
        });

        while (deltas.reduce((total, current) => total + Math.abs(current), 0) !== 0)
        {
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
            if (destCell === null || destCell <= 0)
            {
                break;
            }

            /* Stop iterating when we hit an occupied square, unless jump or hop */
            if (this.board.contents[destCell] !== undefined)
            {
                /* Only jump/hop when moving with that component */
                let canHopObstacle = false;
                components.forEach((component, index) => {
                    if ((component.jump || component.hop) && deltas[index] !== 0)
                        canHopObstacle = true;
                });

                if (canHopObstacle)
                {
                    continue;
                }
                break;
            }
        }

        /* If hop, only output when previous cell is occupied */
        let hop = false;
        components.forEach((component) => {
            if (component.hop)
            {
                hop = true;
            }
        });
        if (hop && this.board.contents[prevCell] === undefined)
        {
            return null;
        }

        return destCell;
    }
}