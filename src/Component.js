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
	
	static DeepCopy(component)
	{
		return new Component(component.length, component.maxRep, component.jump, component.hop, component.promote);
	}
	
	toString()
	{
		return this.length + (this.maxRep > 1 ? "{" + this.maxRep + "}" : "") + 
			(this.jump ? "j" : "") + (this.hop ? "h" : "") + (this.promote ? "p" : "")
	}

	static Create(localFlags, globalFlags)
	{
		const component = new Component
		(
			Number(localFlags.match(/(-?\d+)/g)[0]),
			1,
			localFlags.includes("j") || globalFlags.includes("j"),
			localFlags.includes("h") || globalFlags.includes("h"),
			localFlags.includes("p") || globalFlags.includes("p")
		);

		const globalFiniteRepetition = globalFlags.match(/{(\d+)}/);
		const globalInfiniteRepetition = globalFlags.includes("+");
		const localFiniteRepetition = localFlags.match(/{(\d+)}/);
		const localInfiniteRepetition = localFlags.includes("+");

		/* Check for global finite and infinite repetition */
		if (globalFiniteRepetition && globalInfiniteRepetition)
		{
			throw "ERROR: Component global flags contain both a finite and an infinite repetition flag";
		}
		else if (globalFiniteRepetition)
		{
			component.maxRep = Number(globalFiniteRepetition[1]);
		}
		else if (globalInfiniteRepetition)
		{
			component.maxRep = 100;
		}

		/* Check for local finite and infinite repetition */
		if (localFiniteRepetition && localInfiniteRepetition)
		{
			throw "ERROR: Component local flags contain both a finite and an infinite repetition flag";
		}
		else if (localFiniteRepetition)
		{
			component.maxRep = Number(localFiniteRepetition[1]);
		}
		else if (localInfiniteRepetition)
		{
			component.maxRep = 100;
		}

		/* slight efficiency, clean output for debugging */
		if (component.length === 0)
		{
			component.maxRep = 1;
		}

		const reversedComponent = new Component(-component.length, component.maxRep, component.jump, component.hop, component.promote);
		return localFlags.includes("d") || globalFlags.includes("d") || component.length === 0 ? [component] : [component, reversedComponent];
	}
}
