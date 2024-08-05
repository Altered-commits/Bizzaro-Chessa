class ChessPiece {
    constructor(id) {
        this.id = id
    }

    render() {
        const pieceDiv = document.createElement("div");
        
        pieceDiv.classList.add("ChessPiece");
        pieceDiv.id        = this.id;
        pieceDiv.innerHTML = `<img src='ChessPiecesPng/${this.id.slice(0, -1)}.png'>`

        return pieceDiv;
    }
}

class Pawn extends ChessPiece
{
    constructor(id) {
        super(id);
        this.startingPawnMovement = true;
    }

    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        const movementSquareId = (pieceColor === 'W' ? 1 : -1);

        if(this.startingPawnMovement) {
            if(startId == (endId + (8 * movementSquareId)) || startId == (endId + (16 * movementSquareId))) {
                this.startingPawnMovement = false;
                return true;
            }
        }
        else
            return startId == (endId + (8 * movementSquareId));

        return false;
    }
}

class Rook extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        return (((startId - endId) % 8) === 0) || (Math.floor((startId) / 8) === (Math.floor((endId) / 8)));
    }
}

class Bishop extends ChessPiece
{

}

class Knight extends ChessPiece {}
class Queen  extends ChessPiece {}
class King   extends ChessPiece {}