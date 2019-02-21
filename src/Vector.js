/* Convenience class to store a vector and its associated flags */
class Vector
{
	constructor(x, y)
	{
		this.components = [x, y];
	}
	
	toString()
	{
		const vectorString = this.components.map(c => c.toString()).join(", ");
		return `(${vectorString})`;
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
		const vectors = [];
		
		/* Iterate over each vector string, delimited by semicolon */
		str.split(";").forEach((substring) => {
			const vectorString = substring.trim();
			if (vectorString === "")
			{
				/* Ignore empty strings - common if vector list ended with semicolon */
				return;
			}
			
			const checkValid = vectorString.match(/\(\ *-?\d+[\d{}+jhpmd]*\ *,\ *-?\d+[\d{}+jhpmd]*\ *\)[\d{}+jhpmd]*/g);
			if (checkValid === null || checkValid.length <= 0)
			{
				console.error(`Improperly formatted vector: ${vectorString}`);
				return;
			}
			
			/* Identify components */
			const globalFlags = vectorString.slice(vectorString.indexOf(")")+1);
			const componentStrings = vectorString.slice(vectorString.indexOf("(")+1, vectorString.indexOf(")")).split(",");
			
			/* Build x and y components */
			const xComponents = Component.Create(componentStrings[0], globalFlags);
			const yComponents = Component.Create(componentStrings[1], globalFlags);
			
			/* Cross product all components to produce directional vectors */
			// TODO: rewrite when updating to N-dimensions
			vectors.push(...CrossProduct(xComponents, yComponents));
		});

		return vectors;
		
		/* Helper function */
		function CrossProduct(xComponents, yComponents)
		{
			const crossProduct = [];

			xComponents.forEach((xComponent) => {
				yComponents.forEach((yComponent) => {
					crossProduct.push(new Vector(xComponent, yComponent));
				})
			});

			return crossProduct;
		}
	}
}
