class MatrixUtilities
{
	static GetDirectionsByVector(vectorAxis, vectorSign, dimensions)
	{
		const directions = [];
		for (let direction = 0; direction < Math.pow(3, dimensions); direction++)
		{
			const vector = [];
			for (let axis = 0; axis < dimensions; axis++)
			{
				vector.push(Math.floor(direction / Math.pow(3, axis)) % 3);
			}
			if (vector[vectorAxis] === vectorSign)
			{
				directions.push(direction);
			}
		}
		return directions;
	}
	
	static GetCoordinates(value, matrix, dimensions)
	{
		if (dimensions === 1)
		{
			if (matrix.includes(value))
			{
				return [matrix.indexOf(value)];
			}
			return undefined;
		}
		for (let i = 0; i < matrix.length; i++)
		{
			const coords = MatrixUtilities.GetCoordinates(value, matrix[i], dimensions - 1);
			if (coords !== undefined)
			{
				coords.unshift(i);
				return coords;
			}
		}
		return undefined;
	}
	
	/**
	 * Inserts a new row in the matrix before the specified index.
	 * If rIndex is 0, adds a row to the top. If rIndex is matrix.length,
	 * adds a row to the bottom.
	 */
	static InsertRowInMatrix(matrix, rowIndex, fillValue = 0)
	{
		matrix.splice(rowIndex, 0, []);
		for (let i = 0; i < matrix[0].length; i++)
		{
			matrix[rowIndex].push(fillValue);
		}
	}
	
	/**
	 * Inserts a new column in the matrix before the specified index.
	 * If cIndex is 0, adds a column to the left. If cIndex is
	 * matrix[0].length, adds a row to the bottom.
	 */
	static InsertColumnInMatrix(matrix, colIndex, fillValue = 0)
	{
		for (let i = 0; i < matrix.length; i++)
		{
			matrix[i].splice(colIndex, 0, fillValue);
		}
	}
	
	static MatrixToString(matrix, dimensions)
	{
		if (dimensions === 1)
		{
			return "[" + matrix.toString() + "]";
		}
		
		let output = "[";
		for (let i = 0; i < matrix.length; i++)
		{
			output += MatrixUtilities.MatrixToString(matrix[i], dimensions - 1) + ",";
		}
		output = output.slice(0, -1) + "]";
		return output;
	}
}

class ArrayUtilities
{
	static ProductOfLastN(array, n)
	{
		const cutoff = Math.max(Math.min(array.length - n, array.length), 0);
		return array.reduceRight(
			(totalProduct, currentValue, currentIndex) => {
				if (currentIndex < cutoff) return totalProduct;
				return totalProduct * currentValue;
			},
			1
		);
	}
}