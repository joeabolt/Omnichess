class Engine {
    constructor() {
        self.context = undefined;
        self.allContexts = [];
        self.board = [];
        self.pieces = [];
        self.pieceSchema = ["LocationSet location", "Number player"];
    }

    setProperties(propertiesList) {
        propertiesList.forEach((property) => {
            if (!self.pieceSchema.contains(property)) {
                self.pieceSchema.push(property);
            }
        });

        // TODO: Assert all properties over all pieces
    }

    addPiece(piece) {
        // Validate piece
        self.pieceSchema.forEach((property) => {
            const dataType = property.match(/\S+/g)[0];
            const propertyName = property.match(/\S+/g)[1];
            if (piece[propertyName] === undefined || piece[propertyName] === null) {
                throw(`All pieces must have required property: ${propertyName}!`);
            }
            // TODO: Validate against datatype
        });

        self.pieces.push(piece);

        // temp
        if (self.context) {
            self.context.variables.push([piece]);
        }
    }

    buildContext() {
        self.context = { variables: [], vectors: [] };
        self.allContexts.push(self.context);
    }

    releaseContext() {
        self.allContexts.pop();
        self.context = self.allContexts[self.allContexts.length - 1];
    }

    parse(inputString) {
        // Trim out whitespaces into single spaces
        inputString.replace(/\s+/g, " ");
        inputString = inputString.toLowerCase().trim();

        // tokenize, begin processing
        const tokens = inputString.match(/\S+/g);

        // Beging processing and building output
        let output = "";
        while (tokens.length > 0) {
            const currToken = tokens.shift() + "";
            if (currToken.indexOf("(") >= 0) { // Handle parentheses
                let openParenCount = currToken.split("(").length - currToken.split(")").length;
                let wrappedString = currToken;
                while (openParenCount > 0) {
                    const nextToken = tokens.shift();
                    openParenCount = openParenCount + nextToken.split("(").length - nextToken.split(")").length;
                    wrappedString += " " + nextToken;
                }
                wrappedString = wrappedString.slice(1, -1);
                tokens.unshift(this.parse(wrappedString));
            } else if (currToken == "get") {
                const target = tokens.shift(); // will be a variable (var[x])
                const property = tokens.shift();
                const varIndex = target.match(/\d+/g)[0];
                tokens.unshift(self.context.variables[varIndex][0][property]);
            } else if (currToken == "set") {
                const target = tokens.shift();
                const property = tokens.shift();
                const value = tokens.shift();
                const varIndex = target.match(/\d+/g)[0];
                self.context.variables[varIndex].forEach((piece) => piece[property] = value);
            } else if (currToken.indexOf("<") >= 0) {
                let vectorString = currToken;
                while (vectorString.indexOf(">") === -1) vectorString += tokens.shift();
                const newVectorIndex = self.context.vectors.length;
                self.context.vectors[newVectorIndex] = Vector.parse(vectorString);
                tokens.unshift("vec[" + newVectorIndex + "]");
            } else if (currToken == "find") {
                const varType = tokens.shift();
                const varTarget = tokens.shift();
                tokens.shift(); // clears the pipe
                // Grab parens and send to a find function
            } else if (!isNaN(parseInt(currToken))) { // number
                const firstNum = parseInt(currToken);
                const operator = tokens.shift();
                let secondNum = 0;
                let unshiftThing = undefined;
                switch (operator) {
                    case "+":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum + secondNum;
                        break;
                    case "-":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum - secondNum;
                        break;
                    case "*":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum * secondNum;
                        break;
                    case "/":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum / secondNum;
                        break;
                    case "=":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum == secondNum;
                        break;
                    case "!=":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum != secondNum;
                        break;
                    case ">":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum > secondNum;
                        break;
                    case "<":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum < secondNum;
                        break;
                    case ">=":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum >= secondNum;
                        break;
                    case "<=":
                        secondNum = parseInt(tokens.shift());
                        unshiftThing = firstNum <= secondNum;
                        break;
                    case undefined: // just a number, no more tokens
                        output += (output.length > 0 ? " " : "") + currToken;
                        break;
                    default: // just a number; not an equation, and more tokens
                        output += (output.length > 0 ? " " : "") + currToken;
                        unshiftThing = operator;
                }
                if (unshiftThing !== undefined) {
                    tokens.unshift("" + unshiftThing);
                }
            } else {
                output += (output.length > 0 ? " " : "") + currToken;
            }
        }

        return output;
    }

    findPieces(destVariable, filterString) {
        const filters = filterString.split(";").map(str => str.trim());
        const possiblePieces = self.pieces.map(a => a);
        filters.forEach((filter) => {
            const tokens = inputString.match(/\S+/g);
            const currToken = tokens.shift();
            while (tokens.length > 0) {
                if (currToken === "get") {
                    
                }
            }
        });
        const varIndex = destVariable.match(/\d+/g)[0];
        self.context.variables[varIndex] = possiblePieces;
    }
}
