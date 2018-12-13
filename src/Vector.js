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
	 *  If an invalidly formatted string is passed in, an error is thrown.
	 */
	static create(str)
	{
		// TODO: Get all the segments individually
		str = str.match(/([^;\n]+?)(?=;|$)/gm)[0].trim();
		var matches = str.match(/\(-?\d+[\d{}+jhpmd]*, -?\d+[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
		if (matches <= 0)
		{
			// improperly formatted vector notation
			console.error(`Improperly formatted vector: ${str}`);
		}
		
		function buildComponent(compStr, globalStr)
		{
			var comp = new Component(0, 1, false, false, false);
			comp.length = Number(compStr.match(/(-?\d+)/g)[0].slice(1));
			
			// Check for jump on first component or end
			if (compStr.includes("j") || globalStr.includes("j"))
			{
				comp.jump = true;
			}
			
			// Check for hop on first component or end
			if (compStr.includes("h") || globalStr.includes("h"))
			{
				comp.hop = true;
			}
			
			// Check for promote on first component or end
			if (compStr.includes("p") || globalStr.includes("p"))
			{
				comp.promote = true;
			}
			
			// Check for finite repetition on end
			var repetition = globalStr.match(/{(\d+)}/g);
			if (repetition)
			{
				comp.maxRep = Number(repetition[0].slice(2, -1));
			}
			
			// Check for infinite repetition on end
			if(globalStr.includes("+"))
			{
				comp.maxRep = 100; // arbitrarily large
			}
	
			// Check for finite specific repeition
			repetition = compStr.match(/{(\d+)}/);
			if (repetition)
			{
				comp.maxRep = Number(repetition[1]);
			}
			
			// Check for infinite specific repetition
			if (compStr.includes("+"))
			{
				comp.maxRep = 100; // arbitrarily large
			}
			
			return comp;
		}
		
		// Identify components
		var endStr = str.slice(str.indexOf(")")+1);
		var parts = str.slice(str.indexOf("(")+1, str.indexOf(")")).split(",");
		
		/* Build x component */
		var xComp = buildComponent(parts[0], endStr);
		console.log(xComp);
		
		/* Build y component */
		var yComp = buildComponent(parts[1], endStr);
		console.log(yComp);
		
		return [new Vector(xComp, yComp)];
	}
}