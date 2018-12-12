/* Convenience class to store a vector and its associated flags */
class Vector
{
	constructor(x, y)
	{
		this.components = [x, y];
	}
	
	static create(str)
	{
		str = str.match(/([^;\n]+?)(?=;|$)/gm)[0].trim();
		var matches = str.match(/(-?\d[\d{}+jhpmd]*, -?\d[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
		if (matches <= 0)
		{
			// improperly formatted vector notation
			throw new Error("Improperly formatted vector: " + str);
		}
		
		/* Build x component */
		Component xComp = new Component(0, 1, false, false, false);
		
		// Get x length
		var length = Number(str.match(/\((-?\d+)/g)[0]);
		xComp.length = length;
		
		// Check for jump on first component or end
		if (str.match(/(\([^j,]+j[\d{}+hpmd]*, -?\d+[\d{}hpmd]*\))|(\)[\d{}+hpmd]*j[\d{}+hpmd]*)/g).length > 0)
		{
			xComp.jump = true;
		}
		
		// Check for hop on first component or end
		if (str.match(/(\([^h,]+h[\d{}+jpmd]*, -?\d+[\d{}jpmd]*\))|(\)[\d{}+jpmd]*h[\d{}+jpmd]*)/g).length > 0)
		{
			xComp.hop = true;
		}
		
		/* Build y component */
	}
}