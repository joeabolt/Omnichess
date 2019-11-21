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
            self.context.variables.push(piece);
        }
    }

    buildContext() {
        self.context = { variables: [] };
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

        // Handle parens
        // TODO: handle from left to right because of context-shifts (if, find)
        while (inputString.indexOf("(") > -1) {
            const closeParen = inputString.indexOf(")");
            const openParen = inputString.lastIndexOf("(", closeParen);
            const substring = inputString.substring(openParen + 1, closeParen);
            inputString = inputString.substring(0, openParen) + this.parse(substring) + inputString.substring(closeParen + 1);
        }

        // tokenize, being processing
        const tokens = inputString.match(/\S+/g);

        // Beging processing and building output
        let output = "";
        while (tokens.length > 0) {
            const currToken = tokens.shift();
            if (currToken == "get") {
                const target = tokens.shift(); // will be a variable (var[x])
                const property = tokens.shift();
                const varIndex = target.match(/\d+/g)[0];
                tokens.unshift(self.context.variables[varIndex][property]);
            } else if (!isNaN(parseInt(currToken))) {
                const firstNum = parseInt(currToken);
                const operator = tokens.shift();
                let secondNum = 0;
                switch (operator) {
                    case "+":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum + secondNum);
                        break;
                    case "-":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum - secondNum);
                        break;
                    case "*":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum * secondNum);
                        break;
                    case "/":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum / secondNum);
                        break;
                    case "=":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum == secondNum);
                        break;
                    case "!=":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum != secondNum);
                        break;
                    case ">":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum > secondNum);
                        break;
                    case "<":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum < secondNum);
                        break;
                    case ">=":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum >= secondNum);
                        break;
                    case "<=":
                        secondNum = parseInt(tokens.shift());
                        tokens.unshift(firstNum <= secondNum);
                        break;
                    case undefined: // just a number, no more tokens
                        output += (output.length > 0 ? " " : "") + currToken;
                        break;
                    default: // just a number; not an equation, and more tokens
                        output += (output.length > 0 ? " " : "") + currToken;
                        tokens.unshift(operator);
                }
            } else {
                output += (output.length > 0 ? " " : "") + currToken;
            }
        }

        return output;
    }
}
