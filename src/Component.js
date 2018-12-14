/* Represents a component of a vector */
class Component
{
	constructor(length, maxRep, jump, hop, promote)
	{
		this.length = length;
		this.maxRep = maxRep;
		this.jump = jump;
		this.hop = hop;
		this.promote = promote;
	}
	
	static Create(compStr, globalStr)
	{
		var comp = new Component(0, 1, false, false, false);
		comp.length = Number(compStr.match(/(-?\d+)/g)[0]);
		
		/* Check for jump on first component or end */
		if (compStr.includes("j") || globalStr.includes("j"))
		{
			comp.jump = true;
		}
		
		/* Check for hop on first component or end */
		if (compStr.includes("h") || globalStr.includes("h"))
		{
			comp.hop = true;
		}
		
		/* Check for promote on first component or end */
		if (compStr.includes("p") || globalStr.includes("p"))
		{
			comp.promote = true;
		}
		
		/* Check for finite repetition on end */
		var repetition = globalStr.match(/{(\d+)}/g);
		if (repetition)
		{
			comp.maxRep = Number(repetition[0].slice(2, -1));
		}
		
		/* Check for infinite repetition */
		if(compStr.includes("+") || globalStr.includes("+"))
		{
			comp.maxRep = 100; /* arbitrarily large */
		}

		/* Check for finite specific repeition */
		repetition = compStr.match(/{(\d+)}/);
		if (repetition)
		{
			comp.maxRep = Number(repetition[1]);
		}
		
		/* Check for directional or zero length */
		if (compStr.includes("d") || globalStr.includes("d") || comp.length == 0)
		{
			return [comp];
		}
		
		var reverseComp = new Component(comp.length * -1, comp.maxRep, 
			comp.jump, comp.hop, comp.promote);
			
		return [comp, reverseComp];
	}
}
