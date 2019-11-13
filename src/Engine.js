class Engine {
    constructor() {
        self.context = [];
        self.board = [];
        self.pieces = [];
    }

    parse(inputString) {
        // Trim out whitespaces into single spaces
        inputString.replace(/\s+/g, " ");
        return inputString;
    }
}