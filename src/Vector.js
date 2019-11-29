class VectorComponent {
    constructor(magnitude) {
        self.magnitude = magnitude;
        self.jump = false;
        self.hop = false;
    }

    jump(canJump) {
        self.jump = new Boolean(canJump);
    }

    hop(canHop) {
        self.hop = new Boolean(canHop);
    }

    toString() {
        return magnitude + (self.jump ? "j" : "") + (self.hop ? "h" : "");
    }

    static parse(componentString) {
        componentString = componentString.trim();
        const magnitude = parseInt(componentString.match(/\d+/g)[0]);
        return new componentString(magnitude, componentString.indexOf("j") >= 0, componentString.indexOf("h") >= 0);
    }
}

class Vector {
    constructor(components) {
        self.components = components;
    }

    toString() {
        return "<" + self.components.join(", ") + ">";
    }

    static parse(vectorString) {
        return new Vector(vectorString.split(",").map((componentString) => Component.parse(componentString)));
    }
}