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
			
			/* Cross product all components to produce directional vectors */
			function CrossProduct(arr1, arr2)
			{
				var toReturn = [];
				for (var i = 0; i < arr1.length; i++)
				{
					for (var j = 0; j < arr2.length; j++)
					{
						toReturn.push([arr1[i], arr2[j]]);
					}
				}
				return toReturn;
			}
			
			/* TODO: rewrite when updating to N-dimensions */
			var combinations = CrossProduct(xComp, yComp);
			combinations.forEach(function(element) {
				toReturn.push(new Vector(element[0], element[1]));
			});
		}

		return toReturn;
	}
}
