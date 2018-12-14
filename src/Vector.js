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
		/* Make all possible vectors */
		var toReturn = [];
		var substrings = str.split(";");
		for (var i = 0; i < substrings.length; i++)
		{
			var vectorString = substrings[i].trim();
			if (vectorString == "")
			{
				/* Ignore empty strings - common if vector list ended with semicolon */
				continue;
			}
			
			var matches = vectorString.match(/\(-?\d+[\d{}+jhpmd]*, -?\d+[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
			if (matches == undefined || matches.length <= 0)
			{
				console.error(`Improperly formatted vector: ${vectorString}`);
				continue;
			}
			
			matches = vectorString.match(/(({\d+})[dphj]*\+)|(\+[dphj]*({\d+}))/g);
			if (matches != undefined && matches.length > 0)
			{
				console.error(`Illegal repetition format: ${vectorString}`);
				continue;
			}
			
			/* Identify components */
			var endStr = vectorString.slice(vectorString.indexOf(")")+1);
			var parts = vectorString.slice(vectorString.indexOf("(")+1, vectorString.indexOf(")")).split(",");
			
			/* Build x component */
			var xComp = Component.Create(parts[0], endStr);
			
			/* Build y component */
			var yComp = Component.Create(parts[1], endStr);
			
			/* Cross product all x and y components to produce directional vectors */
			for (var j = 0; j < xComp.length; j++)
			{
				for (var k = 0; k < yComp.length; k++)
				{
					toReturn.push(new Vector(xComp[j], yComp[k]));
				}
			}
		}

		return toReturn;
	}
}
