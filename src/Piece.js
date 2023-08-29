/* Represents a piece in the game */
class Piece  {
    constructor() {
        this.moveVectors = [];
        this.captureVectors = [];
        this.moveCaptureVectors = [];
        this.identifier = "";
        this.value = 1;
        this.player = undefined;
        this.direction = undefined;

        /* For distinguishing first-move actions */
        this.moves = 0;
        this.initialMoveVectors = [];
        this.initialCaptureVectors = [];
        this.initialMoveCaptureVectors = [];
    }

    asJson() {
        return {
            moveVectors: this.moveVectors,
            captureVectors: this.captureVectors,
            moveCaptureVectors: this.moveCaptureVectors,
            identifier: this.identifier,
            color: this.player ? this.player.color : undefined
        };
    }

    static Create(baseObj) {
        /* Currently assumes baseObj has a string for
         * move, capture, moveCapture, and player.
         */
        return new Piece()
            .setMoveVectors(Vector.Create(baseObj.move))
            .setCaptureVectors(Vector.Create(baseObj.capture))
            .setMoveCaptureVectors(Vector.Create(baseObj.moveCapture))
            .setIdentifier(baseObj.identifier)
            .setPlayer(baseObj.player);
    }

    /**
     *  Sets a piece to face the direction passed in as an array of 1s or -1s.
     *  Changes the length of vector components, so it only really applies if
     *  the piece has directional vectors.
     */
    setDirection(direction) {
        if (this.direction !== undefined) {
            for(let i = 0; i < this.direction.length; i++) {
                this.direction *= direction[i];
            }
        }
        else {
            this.direction = direction;
        }
        
        this.moveVectors.concat(this.captureVectors).concat(this.moveCaptureVectors).forEach((vector) => {
            if (vector.synchronized) {
                const flip = direction.reduce((flip, x) => flip * x, 1);
                for (let i = 0; i < vector.components.length; i++) {
                    vector.components[i].length *= flip;
                }
            } else {
                for (let i = 0; i < vector.components.length; i++) {
                    vector.components[i].length *= direction[i];
                }
            }
        });

        return this;
    }

    setMoveVectors(moveVectors) {
        this.moveVectors = moveVectors;
        this.initialMoveVectors = this.moveVectors.filter((vector) => {
            return vector.components.reduce((initial, component) => {
                return initial || component.initial;
            }, false);
        });
        return this;
    }

    setCaptureVectors(captureVectors) {
        this.captureVectors = captureVectors;
        this.initialCaptureVectors = this.captureVectors.filter((vector) => {
            return vector.components.reduce((initial, component) => {
                return initial || component.initial;
            }, false);
        });
        return this;
    }

    setMoveCaptureVectors(moveCaptureVectors) {
        this.moveCaptureVectors = moveCaptureVectors;
        this.initialMoveCaptureVectors = this.moveCaptureVectors.filter((vector) => {
            return vector.components.reduce((initial, component) => {
                return initial || component.initial;
            }, false);
        });
        return this;
    }

    setIdentifier(identifier) {
        this.identifier = identifier;
        return this;
    }

    setPlayer(player) {
        this.player = player;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setMoves(delta) {
        const noPriorMove = this.moves === 0;
        this.moves += delta;

        /* If first move, remove initial vectors */
        if (this.moves > 0 && noPriorMove) {
            this.moveVectors = this.moveVectors.filter((vector) => !this.initialMoveVectors.includes(vector));
            this.captureVectors = this.captureVectors.filter((vector) => !this.initialCaptureVectors.includes(vector));
            this.moveCaptureVectors = this.moveCaptureVectors.filter((vector) => !this.initialMoveCaptureVectors.includes(vector));
        }

        /* If undoing first move, restore initial vectors */
        if (!noPriorMove && this.moves === 0) {
            this.moveVectors = this.moveVectors.concat(this.initialMoveVectors);
            this.captureVectors = this.captureVectors.concat(this.initialCaptureVectors);
            this.moveCaptureVectors = this.moveCaptureVectors.concat(this.initialMoveCaptureVectors);
        }
    }

    undoDirection() {
        let nextDirection = [];
        for(let i = 0; i < this.direction.length; i++) {
            nextDirection.push(1 / this.direction[i]);
        }
        this.setDirection(nextDirection);
    }
}

if (typeof window === 'undefined') {
    module.exports.Piece = Piece;
}
