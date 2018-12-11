/* Convenience class to store a vector and its associated flags */
class Vector
{
	constructor(x, y)
	{
		this.components = [x, y];
		this.maxRepetitions = [1, 1];
		this.jump = [false, false];
		this.hop = [false, false];
		this.promote = [false, false];
	}
	
	static create(str)
	{
		str = str.match(/([^;\n]+?)(?=;|$)/gm)[0].trim();
		var matches = str.match(/(-?\d[\d{}+jhpmd]*, -?\d[\d{}+jhpmd]*\)[\d{}+jhpmd]*/g);
		if (matches <= 0)
		{
			// improperly formatted vector notation
		}
	}
}