/* Represents the board state at a point in time */
class Board 
{
    constructor(adjacencyMatrix)
    {
        this.cells = adjacencyMatrix;
        /* The below works because we insist on a square/cubic grid */
        this.dimensions = Math.round(Math.log(adjacencyMatrix[0].length) / Math.log(3));
        this.contents = [];

        /* Has an extra cell (0), but will never be used, and makes stuff line up */
        for (let i = 0; i <= this.cells.length; i++)
        {
            this.contents.push(undefined);
        }
    }

    /**
     * Produces a matrix. Each cell represents a visible slot on the board.
     * Where these cells are not included in the board, they contain negative values. Otherwise, 
     * they contain the index of the cell they represent.
     */
    ConvertToArray()
    {
        if (this.cells.length === 0)
        {
            return MatrixUtilities.GetEmptyMatrix(this.dimensions);
        }

        const outputBoard = MatrixUtilities.GetEmptyMatrix(this.dimensions);
        const cellsToAdd = [];

        /* Create space for first cell, from which to create the rest of the board */
        MatrixUtilities.InsertHyperplaneInMatrix(0, -1, outputBoard, this.dimensions);

        /* Use the center direction to correctly get the index of the first cell */
        const firstCell = this.cells[0][(Math.pow(3, this.dimensions) - 1) / 2]

        /* Navigate in to the location for the first cell, and place it there */
        let root = outputBoard;
        for (let i = 1; i < this.dimensions; i++)
        {
            root = root[0];
        }
        root[0] = firstCell;

        /* Manually perform first expansion */
        cellsToAdd.push(...this.Expand(firstCell, outputBoard));

        /* Breadth-first expand */
        while (cellsToAdd.length > 0)
        {
            const index = cellsToAdd.shift();
            cellsToAdd.push(...this.Expand(Math.abs(index), outputBoard));
        }

        return outputBoard;
    }

    /**
     * Expands the passed-in matrix at the index. Adds hyperplanes (in 2D, rows or
     * columns) to make room if necessary. Returns a list of indices for any cells added.
     */
    Expand(index, matrix)
    {
        let coordinates = MatrixUtilities.GetCoordinates(index, matrix, this.dimensions);
        if (coordinates === undefined)
        {
            coordinates = MatrixUtilities.GetCoordinates(-1 * index, matrix, this.dimensions);
            if (coordinates === undefined) 
            {
                throw "No such element in matrix!";
            }
        }
        const neighbors = this.cells[Math.abs(index) - 1];
        const cellsAdded = [];

        for (let direction = 0; direction < neighbors.length; direction++)
        {
            /* Skip if no neighbor in this direction */
            if (neighbors[direction] === null)
            {
                continue;
            }

            /* Skip over cells that have already been inserted */
            if (MatrixUtilities.GetCoordinates(neighbors[direction], matrix, this.dimensions) !== undefined)
            {
                continue;
            }

            const directionVector = MatrixUtilities.DirectionToVector(direction, this.dimensions);
            const lengths = MatrixUtilities.GetLengths(matrix).reverse();

            /* Widen matrix to make room, if necessary */
            for (let axis = 0; axis < directionVector.length; axis++)
            {
                /* If at low-value edge of axis and need to insert before, do negative expansion */
                if (directionVector[axis] === -1 && coordinates[axis] === 0)
                {
                    MatrixUtilities.InsertHyperplaneInMatrix(axis, -1, matrix, this.dimensions);
                    coordinates[axis] = 1
                }

                /* If at high-value edge of axis and need to insert after, do positive expansion */
                if (directionVector[axis] === 1 && coordinates[axis] === lengths[axis] - 1)
                {
                    MatrixUtilities.InsertHyperplaneInMatrix(axis, 1, matrix, this.dimensions);
                }
            }

            /* Coordinates for neighbor cell. Reversed to align axis order */
            const newCoordinates = directionVector.map((currentValue, currentIndex) => {
                return currentValue + coordinates[currentIndex];
            }).reverse();

            /* Navigate to one dimension above the insertion point */
            let insertionPoint = matrix;
            for (let axis = 0; axis < this.dimensions - 1; axis++)
            {
                insertionPoint = insertionPoint[newCoordinates[axis]];
            }

            /* Perform insertion */
            insertionPoint[newCoordinates[newCoordinates.length - 1]] = neighbors[direction];
            cellsAdded.push(neighbors[direction]);
        }

        return cellsAdded;
    }

    /**
     * Generates and returns an adjacency matrix with the lengths specified in dimensions,
     * an array of integers. Uses a n-dimensional matrix, where n = dimensions.length.
     */
    static Generate(dimensions)
    {
        const adjacencyMatrix = [];
        const cellCount = ArrayUtilities.ProductOfLastN(dimensions, dimensions.length);
        const directions = Math.pow(3, dimensions.length);

        /* This loop assumes validity of all directions and initalizes the adjacency matrix */
        for (let i = 1; i <= cellCount; i++)
        {
            adjacencyMatrix.push([]);
            for (let direction = 0; direction < directions; direction++)
            {
                let totalOffset = 0;
                for (let axis = 0; axis < dimensions.length; axis++)
                {
                    const powerOfThree = Math.pow(3, axis);
                    const increment = ArrayUtilities.ProductOfLastN(dimensions, axis);

                    /* Mod (direction divided by (3^axis), rounding up) by 3
                     * If 0, subtract (3^axis) from totalOffset
                     * If 1, direction is centered on axis - leave totalOffset unchanged
                     * If 2, add (3^axis) from totalOffset
                     */
                    const magicNumber = Math.floor(direction / powerOfThree) % 3;
                    if (magicNumber === 0)
                    {
                        totalOffset -= increment;
                    }
                    if (magicNumber === 2)
                    {
                        totalOffset += increment;
                    }
                }
                adjacencyMatrix[i - 1].push(i + totalOffset);
            }
        }

        /* This loop marks invalid directions.
         * It marks them one dimension at a time,
         * first marking all negative out of bounds (stepping to a lower index)
         * and then all positive out of bounds (stepping to a higher index).
         *
         * Note that invalids come in contiguous segments of indices based
         * on which dimension we are operating in.
         */
        for (let dimension = 0; dimension < dimensions.length; dimension++)
        {
            const segmentLength = ArrayUtilities.ProductOfLastN(dimensions, dimension);
            const distanceBetweenSegments = ArrayUtilities.ProductOfLastN(dimensions, dimension + 1);
            const negativeDirections = MatrixUtilities.GetDirectionsByVector(dimension, 0, dimensions.length);
            const positiveDirections = MatrixUtilities.GetDirectionsByVector(dimension, 2, dimensions.length);

            /* The negative invalids */
            for (let segmentStart = 1; segmentStart <= cellCount; segmentStart += distanceBetweenSegments)
            {
                for (let offset = 0; offset < segmentLength; offset++)
                {
                    for (let directionIndex = 0; directionIndex < negativeDirections.length; directionIndex++)
                    {
                        /* - 1 to convert to matrix indices */
                        adjacencyMatrix[segmentStart + offset - 1][negativeDirections[directionIndex]] = null;
                    }
                }
            }

            /* The positive invalids */
            for (let segmentStart = (distanceBetweenSegments - segmentLength + 1); segmentStart <= cellCount; segmentStart += distanceBetweenSegments)
            {
                for (let offset = 0; offset < segmentLength; offset++)
                {
                    for (let directionIndex = 0; directionIndex < positiveDirections.length; directionIndex++)
                    {
                        /* - 1 to convert to matrix indices */
                        adjacencyMatrix[segmentStart + offset - 1][positiveDirections[directionIndex]] = null;
                    }
                }
            }
        }

        return adjacencyMatrix;
    }
}
