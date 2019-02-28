/* Convenience class to store a vector and its associated flags */
class Vector
{
	constructor(components)
	{
		this.components = components;
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
			
			const checkValid = vectorString.match(/\((\ *-?\d+[\d{}+jhd]*\ *,)+\ *-?\d+[\d{}+jhd]*\ *\)[\d{}+jhd]*/g);
			if (checkValid === null || checkValid.length <= 0)
			{
				console.error(`Improperly formatted vector: ${vectorString}`);
				return;
			}
			
			/* Identify components */
			const globalFlags = vectorString.slice(vectorString.indexOf(")")+1);
			const componentStrings = vectorString.slice(vectorString.indexOf("(")+1, vectorString.indexOf(")")).split(",");
			
			/* Build x and y components */
			const components = [];
			componentStrings.forEach((string) => {
				components.push(Component.Create(string, globalFlags));
			});
			
			/* Cross product all components to produce directional vectors */
			Vector.CrossProduct(components).forEach((crossProduct) => {
				vectors.push(new Vector(crossProduct));
			});
		});

		return vectors;
	}
	
	static CrossProduct(components)
	{
		if (components.length === 1)
			return components;

		const crossProduct = [];
		
		components[0].forEach((component) => {
			const subProducts = Vector.CrossProduct(components.slice(1, components.length));
			subProducts.forEach((subProduct) => {
				subProduct.splice(0, 0, component);
				crossProduct.push(subProduct);
			});
		});
		
		return crossProduct;
	}
}
