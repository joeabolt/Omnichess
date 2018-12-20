/* Represents a component of a vector */
class Component
{
	constructor(length, maxRep, jump, hop, promote)
	{
		this.length = length;
		/* Slight efficiency, clean output while debugging */
		this.maxRep = length !== 0 ? maxRep : 1;
		this.jump = jump;
		this.hop = hop;
		this.promote = promote;
	}
	
	static Create(componentString, globalString)
	{
		const comp = new Component(0, 1, false, false, false);
		comp.length = Number(componentString.match(/(-?\d+)/g)[0]);
		
		/* Check for jump on first component or end */
		if (componentString.includes("j") || globalString.includes("j"))
		{
			comp.jump = true;
		}
		
		/* Check for hop on first component or end */
		if (componentString.includes("h") || globalString.includes("h"))
		{
			comp.hop = true;
		}
		
		/* Check for promote on first component or end */
		if (componentString.includes("p") || globalString.includes("p"))
		{
			comp.promote = true;
		}
		
		/* Check for finite repetition on end */
		const finiteEndRepetition = globalString.match(/{(\d+)}/g);
		if (finiteEndRepetition)
		{
			comp.maxRep = Number(finiteEndRepetition[0].slice(2, -1));
		}
		
		/* Check for infinite repetition */
		if(componentString.includes("+") || globalString.includes("+"))
		{
			comp.maxRep = 100; /* arbitrarily large */
		}

		/* Check for finite specific repeition */
		const finiteSpecificRepetition = componentString.match(/{(\d+)}/);
		if (finiteSpecificRepetition)
		{
			comp.maxRep = Number(finiteSpecificRepetition[1]);
		}
		
		if (comp.length === 0)
		{
			comp.maxRep = 1; // slight efficiency, clean output for debugging
		}
		
		/* Check for directional or zero length */
		if (componentString.includes("d") || globalString.includes("d") || comp.length == 0)
		{
			return [comp];
		}
		
		const reverseComp = new Component(comp.length * -1, comp.maxRep, 
			comp.jump, comp.hop, comp.promote);
			
		return [comp, reverseComp];
	}
}
