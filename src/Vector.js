/* Convenience class to store a vector and its associated flags */
class Vector
{
	constructor(x, y)
	{
		this.components = [x, y];
	}
	
	/**
	 *  Creates one or more Vectors based on the string passed in.
	 *  Returns an array of Vectors containing all Vectors described in the string.
	 *
	 *  If an invalidly formatted string is passed in, an error is logged to the
	 *  console, but execution continues (and all validly formatted Vectors are
	 *  output normally).
	 */
	static Create(str)
	{
		const allVectors = [];
		const substrings = str.split(";");
		
		/* Helper function */
		function CrossProduct(arr1, arr2)
		{
			const crossProduct = [];
			for (let i = 0; i < arr1.length; i++)
			{
				for (let j = 0; j < arr2.length; j++)
				{
					crossProduct.push([arr1[i], arr2[j]]);
				}
			}
			return crossProduct;
		}
		
		substrings.forEach((substring) => {
			const vectorString = substring.trim();
			if (vectorString == "")
			{
				/* Ignore empty strings - common if vector list ended with semicolon */
				return;
			}
			
			const checkValid = vectorString.match(/\(-?\d+[\d{}+jhpmd]*, -?\d+[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
			if (checkValid == undefined || checkValid.length <= 0)
			{
				console.error(`Improperly formatted vector: ${vectorString}`);
				return;
			}
			
			const checkRepetition = vectorString.match(/(({\d+})[dphj]*\+)|(\+[dphj]*({\d+}))/g);
			if (checkRepetition != undefined && checkRepetition.length > 0)
			{
				console.error(`Illegal repetition format: ${vectorString}`);
				return;
			}
			
			/* Identify components */
			const endStr = vectorString.slice(vectorString.indexOf(")")+1);
			const parts = vectorString.slice(vectorString.indexOf("(")+1, vectorString.indexOf(")")).split(",");
			
			/* Build x component */
			const xComp = Component.Create(parts[0], endStr);
			
			/* Build y component */
			const yComp = Component.Create(parts[1], endStr);
			
			/* Cross product all components to produce directional vectors */
			// TODO: rewrite when updating to N-dimensions
			const combinations = CrossProduct(xComp, yComp);
			combinations.forEach((vector) => {
				allVectors.push(new Vector(vector[0], vector[1]));
			});
		});

		return allVectors;
	}
}
