class Engine {
    constructor() {
        self.context = [];
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
    }

    parse(inputString) {
        // Trim out whitespaces into single spaces
        inputString.replace(/\s+/g, " ");
        return inputString;
    }
}
