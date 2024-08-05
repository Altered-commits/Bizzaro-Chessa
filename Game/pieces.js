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

        const forwardOne    = startId - 8 * movementSquareId;
        const forwardTwo    = startId - 16 * movementSquareId;
        const diagonalLeft  = startId - 9 * movementSquareId;
        const diagonalRight = startId - 7 * movementSquareId;

        if(this.startingPawnMovement) {
            let hindrancePieces = false;

            if((endId == forwardTwo))
                hindrancePieces = !document.getElementById(forwardOne).querySelector(".ChessPiece") &&
                                  !document.getElementById(forwardTwo).querySelector(".ChessPiece");
            
            if((endId == forwardOne))
                hindrancePieces = !document.getElementById(forwardOne).querySelector(".ChessPiece");

            this.startingPawnMovement = hindrancePieces ? false : true;
            return hindrancePieces;
        }

        if(endId == forwardOne)
            return !document.getElementById(forwardOne).querySelector(".ChessPiece");
        
        return ((endId == diagonalLeft) && document.getElementById(endId).querySelector(".ChessPiece")) 
            || ((endId == diagonalRight) && document.getElementById(endId).querySelector(".ChessPiece"));
    }
}

class Rook extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        //Determine the direction of movement
        const direction = (endId - startId);
        
        // Check if the move is horizontal or vertical
        const isVertical = (startId % 8 === endId % 8);
        const isHorizontal = (Math.floor(startId / 8) === Math.floor(endId / 8));
        
        if (!(isVertical || isHorizontal)) {
            return false; //Rook can only move in straight lines
        }

        //Determine the step direction
        const step = isVertical ? (endId > startId ? 8 : -8) : (endId > startId ? 1 : -1);
        const limit = isVertical ? (Math.abs(direction) / 8) : (Math.abs(direction));

        let currentId = startId + step;
        
        for (let i = 1; i < limit; i++) {
            if (document.getElementById(currentId).querySelector(".ChessPiece"))
                return false;
            
            currentId += step;
        }

        return true;
    }
}

class Bishop extends ChessPiece
{

}

class Knight extends ChessPiece {}
class Queen  extends ChessPiece {}
class King   extends ChessPiece {}