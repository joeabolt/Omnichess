const {Component} = require("./Component.js");

/* Convenience class to store a vector and its associated flags */
class Vector {
    constructor(components) {
        this.components = components;
        this.synchronized = false;
    }

    toString() {
        const vectorString = this.components.map(c => c.toString()).join(", ");
        return `(${vectorString})`;
    }

    /**
     *  Creates one or more Vectors based on the string passed in.
     *  Returns an array of Vectors containing all Vectors described in the string.
     *
     *  If an invalidly formatted string is passed in, an error is logged to the
     *  console, but execution continues (and all validly formatted Vectors are
     *  output normally).
     */
    static Create(str) {
        const vectors = [];

        /* Iterate over each vector string, delimited by semicolon */
        str.split(";").forEach((substring) => {
            const vectorString = substring.trim();
            if (vectorString === "") {
                /* Ignore empty strings - common if vector list ended with semicolon */
                return;
            }

            const checkValid = vectorString.match(/\((\ *-?\d+[\d{}+jhdi]*\ *,)+\ *-?\d+[\d{}+jhdi]*\ *\)[\d{}+jhdis]*/g);
            if (checkValid === null || checkValid.length <= 0) {
                console.error(`Improperly formatted vector: ${vectorString}`);
                return;
            }

            /* Identify components */
            const globalFlags = vectorString.slice(vectorString.indexOf(")")+1);
            const componentStrings = vectorString.slice(vectorString.indexOf("(")+1, vectorString.indexOf(")")).split(",");

            /* Build components */
            const components = [];
            componentStrings.forEach((string) => {
                components.push(Component.Create(string, globalFlags));
            });

            /* Sort them with "large" axis in front */
            components.reverse();

            /* Cross product all components to produce directional vectors */
            let combinationMethod = Vector.CrossProduct;
            if (globalFlags.includes("s")) {
                combinationMethod = Vector.SyncCombineComponents;
            }
            combinationMethod(components).forEach(crossProduct => {
                const newVector = new Vector(crossProduct);
                if (globalFlags.includes("s")) {
                    newVector.synchronized = true;
                }
                vectors.push(newVector);
            });
        });

        return vectors;
    }

    static CrossProduct(components) {
        let crossProducts = [];
        let newRound = [];
        for (let i = 0; i < components.length; i++) {
            for (let j = 0; j < components[i].length; j++) {
                if (i === 0) {
                    newRound.push(Component.DeepCopy(components[i][j]));
                    continue;
                }
                for (let k = 0; k < crossProducts.length; k++) {
                    const updatedVersion = [Component.DeepCopy(components[i][j])]
                    if (crossProducts[k] instanceof Component) {
                        updatedVersion.push(Component.DeepCopy(crossProducts[k]));
                    }
                    else {
                        updatedVersion.push(...crossProducts[k].map(x => Component.DeepCopy(x)));
                    }
                    newRound.push(updatedVersion);
                }
            }
            crossProducts = newRound;
            newRound = [];
        }
        return crossProducts;
    }

    /**
     * Instead of a cross-product, combine all "forward" components and all "backward" components
     */
    static SyncCombineComponents(components) {
        const outputs = [];
        components.reverse();
        outputs.push(components.map(options => options[0]));
        outputs.push(components.map(options => options.length === 2 ? options[1] : options[0]));
        components.reverse();
        return outputs;
    }
}

if (typeof window === 'undefined') {
    module.exports.Vector = Vector;
}