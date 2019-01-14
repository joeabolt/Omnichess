/* Represents a component of a vector */
class Component {
	constructor(length, maxRep, jump, hop, promote) {
		this.length = length;
		/* Slight efficiency, clean output while debugging */
		this.maxRep = length !== 0 ? maxRep : 1;
		this.jump = jump;
		this.hop = hop;
		this.promote = promote;
	}

	static Create(componentString, globalString) {
		const component = new Component(
			Number(componentString.match(/(-?\d+)/g)[0]),
			1,
			componentString.includes("j") || globalString.includes("j"),
			componentString.includes("h") || globalString.includes("h"),
			componentString.includes("p") || globalString.includes("p")
		);

		const globalFiniteRepetition = globalString.match(/{(\d+)}/);
		const globalInfiniteRepetition = globalString.includes("+");
		const localFiniteRepetition = componentString.match(/{(\d+)}/);
		const localInfiniteRepetition = componentString.includes("+");

		// Check for global finite and infinite repetition
		if (globalFiniteRepetition && globalInfiniteRepetition) {
			throw "ERROR: Component global flags contain both a finite and an infinite repetition flag";
		} else if (globalFiniteRepetition) {
			component.maxRep = Number(globalFiniteRepetition[1]);
		} else if (globalInfiniteRepetition) {
			component.maxRep = 100;
		}

		// Check for local finite and infinite repetition
		if (localFiniteRepetition && localInfiniteRepetition) {
			throw "ERROR: Component local flags contain both a finite and an infinite repetition flag";
		} else if (localFiniteRepetition) {
			component.maxRep = Number(localFiniteRepetition[1]);
		} else if (localInfiniteRepetition) {
			component.maxRep = 100;
		}

		if (component.length === 0) {
			component.maxRep = 1; // slight efficiency, clean output for debugging
		}

		const reversedComponent = new Component(-component.length, component.maxRep, component.jump, component.hop, component.promote);
		return componentString.includes("d") || globalString.includes("d") || component.length === 0 ? [component] : [component, reversedComponent];
	}
}
