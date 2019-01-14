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
		const component = new Component(0, 1, false, false, false);
		component.length = Number(componentString.match(/(-?\d+)/g)[0]);
		
		/* Check for jump on first component or end */
		component.jump = componentString.includes("j") || globalString.includes("j");
		
		/* Check for hop on first component or end */
		component.hop = componentString.includes("h") || globalString.includes("h");
		
		/* Check for promote on first component or end */
		component.promote = componentString.includes("p") || globalString.includes("p");
		
		/* Check for finite repetition on end */
		const globalFiniteRepetition = globalString.match(/{(\d+)}/g);
		if (globalFiniteRepetition)
		{
			component.maxRep = Number(globalFiniteRepetition[0].slice(2, -1));
		}
		
		/* Check for infinite repetition */
		if(componentString.includes("+") || globalString.includes("+"))
		{
			component.maxRep = 100; /* arbitrarily large */
		}

		/* Check for finite specific repeition */
		const localFiniteRepetition = componentString.match(/{(\d+)}/);
		if (localFiniteRepetition)
		{
			component.maxRep = Number(localFiniteRepetition[1]);
		}
		
		if (component.length === 0)
		{
			component.maxRep = 1; // slight efficiency, clean output for debugging
		}
		
		const reversedComponent = new Component(-component.length, component.maxRep, component.jump, component.hop, component.promote);
		return componentString.includes("d") || globalString.includes("d") || component.length === 0 ? [component] : [component, reversedComponent];
	}
}
