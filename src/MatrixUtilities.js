class MatrixUtilities {
    static Index(matrix, coordinates) {
        if (coordinates.length === 0) {
            return matrix;
        }
        if (matrix.length <= coordinates[0]) {
            return null;
        }
        return this.Index(matrix[coordinates[0]], coordinates.slice(1));
    }

    /**
     * Converts a direction index to a vector consisting of -1s, 
     * 0s, and 1s. Assumes the "small" dimensions come first.
     */
    static DirectionToVector(direction, dimensions) {
        let output = [];
        for (let currentDimension = 0; currentDimension < dimensions; currentDimension++) {
            output.push((direction % 3) - 1);
            direction = Math.floor(direction / 3);
        }
        return output;
    }

    /**
     * Given the root of a matrix (which could be the root of a submatrix),
     * and the lengths of the dimensions it contains, fills all such cells
     * with null.
     */
    static FillHyperPlaneInMatrix(root, desiredLengths) {
        if (desiredLengths.length === 1) {
            for (let i = root.length; i < desiredLengths[0]; i++) {
                root.push(null);
            }
            return;
        }
        for (let i = 0; i < desiredLengths[0]; i++) {
            if (i >= root.length) {
                root.push([]);
            }
            MatrixUtilities.FillHyperPlaneInMatrix(root[i], desiredLengths.slice(1, desiredLengths.length));
        }
    }

    /**
     * Returns the coordinates of value within matrix, as an array, smallest
     * axis first. Returns undefined if value could not be found. 
     */
    static GetCoordinates(value, matrix) {
        const dimensions = this.GetLengths(matrix).length;
        if (dimensions === 1) {
            if (matrix.includes(value)) {
                return [matrix.indexOf(value)];
            }
            return undefined;
        }
        for (let i = 0; i < matrix.length; i++) {
            const coords = MatrixUtilities.GetCoordinates(value, matrix[i], dimensions - 1);
            if (coords !== undefined) {
                coords.push(i);
                return coords;
            }
        }
        return undefined;
    }

    /** 
     *  Returns a list of directions (in numeric form) that point in a direction
     *  along a certain axis. vectorSign should be 0 or 2 for each direction, 1
     *  for centered. vectorAxis indicates which axis to be used, with 0 meaning
     *  the smallest.
     */
    static GetDirectionsByVector(vectorAxis, vectorSign, dimensionCount) {
        const directions = [];
        for (let direction = 0; direction < Math.pow(3, dimensionCount); direction++) {
            const vector = [];
            for (let axis = 0; axis < dimensionCount; axis++) {
                vector.push(Math.floor(direction / Math.pow(3, axis)) % 3);
            }
            if (vector[vectorAxis] === vectorSign) {
                directions.push(direction);
            }
        }
        return directions;
    }

    /**
     * Creates and returns an empty matrix that has the
     * specified number of dimensions. E.g., [[[]]] is an
     * empty 3D matrix.
     */
    static GetEmptyMatrix(dimensions) {
        const output = [];
        let pointer = output;
        for (let i = 1; i < dimensions; i++) {
            pointer[0] = [];
            pointer = pointer[0];
        }
        return output;
    }

    /**
     * Returns an array of the lengths of a matrix. Largest dimensions first.
     */
    static GetLengths(matrix) {
        const dimensionalLengths = [];
        let currentDimension = matrix;
        while (Array.isArray(currentDimension)) {
            dimensionalLengths.push(currentDimension.length);
            currentDimension = currentDimension[0];
        }
        return dimensionalLengths;
    }

    static GetMaxLengths(matrix) {
        const dimensionalLengths = [];
        let contestants = [matrix];
        while (contestants.length > 0 && Array.isArray(contestants[0])) {
            let maximumLength = contestants.reduce((maxLength, contestant) => Math.max(maxLength, contestant.length), 0);
            dimensionalLengths.push(maximumLength);
            let nextContestants = [];
            contestants.forEach(contestant => contestant.forEach(child => nextContestants.push(child)));
            contestants = nextContestants;
        }
        return dimensionalLengths;
    }

    /**
     * Inserts a hyperplane into matrix, orthogonal to the axis and on one side of the
     * matrix, either low-value (sign = -1) or high-value (sign = 1). Also fills this
     * new hyperplane with null. Hyperplanes have dimensions = dimensions - 1, so in a
     * square matrix, they create a row or column (in a cube, they make a face).
     */
    static InsertHyperplaneInMatrix(axis, sign, matrix, dimensions) {
        if (dimensions === 1) {
            if (sign < 0) {
                matrix.splice(0, 0, null);
            }
            if (sign > 0) {
                matrix.splice(matrix.length, 0, null);
            }
            return;
        }
        if (dimensions === (axis + 1)) {
            /* Do the insertion */
            let root = undefined;
            if (sign < 0) {
                matrix.splice(0, 0, []);
                root = matrix[0];
            }
            if (sign > 0) {
                matrix.splice(matrix.length, 0, []);
                root = matrix[matrix.length - 1];
            }

            /* Assemble list of dimension lengths */
            const dimensionalLengths = MatrixUtilities.GetLengths(matrix).slice(dimensions - axis , dimensions);

            /* Fill in any gaps */
            MatrixUtilities.FillHyperPlaneInMatrix(root, dimensionalLengths);

            return;
        }
        for (let i = 0; i < matrix.length; i++) {
            MatrixUtilities.InsertHyperplaneInMatrix(axis, sign, matrix[i], dimensions - 1);
        }
    }

    static TrimUnusedHyperplanes(matrix) {
        let lengths = MatrixUtilities.GetMaxLengths(matrix);
        for (let dimension = 0; dimension < lengths.length; dimension++) {
            for (let lockValue = 0; lockValue < lengths[dimension]; lockValue++) {
                const coordinates = this.GetAllCoordinatesInHyperplane(lengths, dimension, lockValue);
                if (coordinates.every(coords => {
                    const value = this.Index(matrix, coords);
                    return value == null;
                })) {
                    // console.log("Removing index " + lockValue + " from dimension " + dimension);
                    this.RemoveHyperplane(matrix, dimension, lockValue);
                    // Reset for next run
                    lockValue--;
                    lengths = MatrixUtilities.GetMaxLengths(matrix);
                }
            }
        }
    }

    static RemoveHyperplane(matrix, dimension, index) {
        if (dimension === 0) {
            matrix.splice(index, 1);
            return matrix;
        }
        for (let i = 0; i < matrix.length; i++) {
            this.RemoveHyperplane(matrix[i], dimension - 1, index);
        }
    }

    static GetAllCoordinatesInHyperplane(lengths, dimensionLock, dimensionValue) {
        if (lengths.length === 1 && dimensionLock !== 0) {
            return new Array(lengths[0]).fill(-1).map((x,i) => i);
        } else if (lengths.length === 1 && dimensionLock === 0) {
            return [dimensionValue];
        } else {
            if (dimensionLock === 0) {
                return this.GetAllCoordinatesInHyperplane(lengths.slice(1), -1, -1)
                    .map(arr => {
                        if (!Array.isArray(arr)) {
                            arr = [arr];
                        }
                        arr.unshift(dimensionValue);
                        return arr;
                    });
            } else {
                const dimLengths = new Array(lengths[0]).fill(-1).map((x,i) => i);
                const allCoords = [];
                for (let i = 0; i < dimLengths.length; i++) {
                    const lowerCoordiantes = this.GetAllCoordinatesInHyperplane(lengths.slice(1), dimensionLock - 1, dimensionValue);
                    lowerCoordiantes.map(arr => {
                        if (!Array.isArray(arr)) {
                            arr = [arr];
                        }
                        arr.unshift(i);
                        return arr;
                    }).forEach(arr => {
                        allCoords.push(arr);
                    });
                }
                return allCoords;
            }
        }
    }

    /**
     * Converts a matrix to a slightly more understandable string
     */
    static MatrixToString(matrix, dimensions) {
        if (dimensions <= 0 || dimensions === undefined || dimensions === null) {
            throw "Dimensions not specified for MatrixToString()!";
        }
        if (dimensions === 1) {
            return "[" + matrix.toString() + "]";
        }

        let output = "[";
        for (let i = 0; i < matrix.length; i++) {
            output += MatrixUtilities.MatrixToString(matrix[i], dimensions - 1) + ",";
        }
        output = output.slice(0, -1) + "]";
        return output;
    }

    /**
     * Converts a numerical vector consisting of -1s, 0s, and 1s to
     * a numerical vector (0 thru 3^n - 1). Assumes the "small" dimensions
     * come first.
     */
    static VectorToDirection(vector) {
        return vector.reduce(
            (direction, currentValue, currentIndex) => {
                direction += Math.pow(3, currentIndex) * (currentValue + 1);
                return direction;
            },
            0
        );
    }

    static Max(matrix) {
        const lengths = this.GetLengths(matrix);
        if (lengths.length === 0) {
            return Math.abs(matrix);
        }
        const firstElement = this.Index(matrix, new Array(lengths.length).fill(0));
        return matrix.reduce((max, arr) => Math.max(max, this.Max(arr)), firstElement);
    }

    /**
     * Rotates the matrix along each dimension until the last value in the first vector is greater than the first value.
     * @param {Array} matrix 
     */
    static RotateMaxesToEnd(matrix) {
        const lengths = this.GetLengths(matrix);
        if (lengths.length === 0) {
            return; // Single value, already sorted
        }
        // Have all my children sort themselves
        matrix.forEach(x => this.RotateMaxesToEnd(x));
        // While elements not sorted, rotate
        const maxIterations = matrix.length;
        let i = 0;
        while (matrix.some((x,i,arr) => i>0 && this.Max(x) < this.Max(arr[i-1])) && i < maxIterations) {
            this.RotateAlongDimension(matrix, 0);
            i++;
        }
    }

    static RotateAlongDimension(matrix, dimension) {
        if (dimension === 0) {
            const save = matrix[0];
            for (let i = 1; i < matrix.length; i++) {
                matrix[i - 1] = matrix[i];
            }
            matrix[matrix.length - 1] = save;
            return;
        }
        for (let i = 0; i < matrix.length; i++) {
            this.RotateAlongDimension(matrix[i], dimension - 1);
        }
    }

    static RotateNullsToFront(matrix) {
        const lengths = this.GetLengths(matrix);
        if (lengths.length === 0) {
            return;
        }
        // Have all my children rotate their nulls to the front
        matrix.forEach(x => this.RotateNullsToFront(x));
        // If this row is filled with null, nothing can be done, exit
        if (this.IsEntirelyNull(matrix)) {
            return;
        }
        // If any of my children is entirely null, rotate them to the front
        const maxIterations = matrix.length;
        let i = 0;
        while (matrix.some((x,i,arr) => i>0 && this.IsEntirelyNull(x) && !this.IsEntirelyNull(arr[i-1])) && i < maxIterations) {
            this.RotateAlongDimension(matrix, 0);
            i++;
        }
    }

    static IsEntirelyNull(matrix) {
        if (matrix == null) return true;
        const lengths = this.GetLengths(matrix);
        if (lengths.length === 0) {
            return false;
        }
        return matrix.every(x => this.IsEntirelyNull(x));
    }
}


if (typeof window === 'undefined') {
    module.exports.MatrixUtilities = MatrixUtilities;
}