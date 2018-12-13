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
		var matches = str.match(/(-?\d+[\d{}+jhpmd]*, -?\d+[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
		if (matches <= 0)
		{
			// improperly formatted vector notation
			console.error(`Improperly formatted vector: ${str}`);
		}
		
		/* Build x component */
		Component xComp = new Component(0, 1, false, false, false);
		
		// Get x length
		var length = Number(str.match(/\((-?\d+)/g)[0]);
		xComp.length = length;
		
		// Check for jump on first component or end
		if (str.match(/(\([^j,]+j[\d{}+hpmd]*, -?\d+[\d{}hpmd]*\))|(\)[\d{}+hpmd]*j)/g).length > 0)
		{
			xComp.jump = true;
		}
		
		// Check for hop on first component or end
		if (str.match(/(\([^h,]+h[\d{}+jpmd]*, -?\d+[\d{}jpmd]*\))|(\)[\d{}+jpmd]*h)/g).length > 0)
		{
			xComp.hop = true;
		}
		
		// Check for promote on first component or end
		if (str.match(/(\([^p,]+p[\d{}+jhmd]*, -?\d+[\d{}jhmd]*\))|(\)[\d{}+jhmd]*p)/g).length > 0)
		{
			xComp.promote = true;
		}
		
		// Check for finite repetition on end
		var repetition = str.match(/\)[jhpmd]*{(\d)}[jhpmd]*/g);
		if (repetition.length > 0)
		{
			xComp.maxRep = Number(repetition[0]);
		}
		
		// Check for infinite repetition on end
		if(str.match(/\)[jhpmd]*\+[jhpmd]*/).length > 0)
		{
			xComp.maxRep = 100; // arbitrarily large
		}

		// Check for finite specific repeition
		repetition = str.match(/\(-?\d[jhpmd]*{(\d+)}/);
		if (repetition.length > 0)
		{
			xComp.maxRep = Number(repetition[0]);
		}
		
		// Check for infinite specific repetition
		if (str.match(/\(-?\d[jhpmd]*\+/))
		{
			xComp.maxRep = 100; // arbitrarily large
		}
		
		console.log(xComp);
		
		/* Build y component */
		
		return [];
	}
}