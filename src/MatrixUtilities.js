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