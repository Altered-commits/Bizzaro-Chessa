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

    validateMovement(startingSquare, endingSquare, pieceColor) {
        return false;
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return false;
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

        const direction = (pieceColor === 'W' ? 1 : -1);

        const forwardOne    = startId - 8 * direction;
        const forwardTwo    = startId - 16 * direction;
        const diagonalLeft  = startId - 9 * direction;
        const diagonalRight = startId - 7 * direction;

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

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        //Logic for pawns attacking diagonally specially implemented
        const startId = +startingSquare;
        const endId   = +endingSquare;
        const direction = (pieceColor === 'W' ? 1 : -1);
        const possibleAttacks = [
            startId - 9 * direction,
            startId - 7 * direction
        ];

        return possibleAttacks.includes(endId);
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

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }
}

class Bishop extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        //Bishop moves diagonally hence their rows & cols need to be in 1 to 1 ratio, same values basically
        const startRow = Math.floor(startId / 8);
        const startCol = startId % 8;
        const endRow = Math.floor(endId / 8);
        const endCol = endId % 8;

        if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) {
            return false;
        }
          
        const rowDirection = (endRow > startRow) ? 1 : -1;
        const colDirection = (endCol > startCol) ? 1 : -1;

        let currentRow = startRow + rowDirection;
        let currentCol = startCol + colDirection;

        //Traverse the path from the starting square to the ending square
        while (currentRow !== endRow && currentCol !== endCol) {
            const currentSquareId = currentRow * 8 + currentCol;
            //Check if there is a piece in the current square
            if (document.getElementById(currentSquareId).querySelector(".ChessPiece"))
                return false;

            currentRow += rowDirection;
            currentCol += colDirection;
        }

        return true;
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }
}

class Knight extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;
        
        const step = endId - startId;

        //Valid knight moves grouped into one big bit list
        const validSteps = 0b101000010001000000;
        return (validSteps >> Math.min(31, Math.abs(step))) & 1;
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }
}

class Queen extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        //Determine the direction of movement
        const directionStraight = (endId - startId);
        
        // Check if the move is horizontal or vertical
        const isVertical = (startId % 8 === endId % 8);
        const isHorizontal = (Math.floor(startId / 8) === Math.floor(endId / 8));

        const startRow = Math.floor(startId / 8);
        const startCol = startId % 8;
        const endRow = Math.floor(endId / 8);
        const endCol = endId % 8;


        if ((!isVertical && !isHorizontal && (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol))))
            return false;
        
        if ((Math.abs(startRow - endRow) === Math.abs(startCol - endCol))){ 
            const rowDirection = (endRow > startRow) ? 1 : -1;
            const colDirection = (endCol > startCol) ? 1 : -1;
    
            let currentRow = startRow + rowDirection;
            let currentCol = startCol + colDirection;

            while (currentRow !== endRow && currentCol !== endCol) {
                const currentSquareId = currentRow * 8 + currentCol;

                if (document.getElementById(currentSquareId).querySelector(".ChessPiece"))
                    return false;

                currentRow += rowDirection;
                currentCol += colDirection;
            }

            return true;
        }
        else {     
            const step = isVertical ? (endId > startId ? 8 : -8) : (endId > startId ? 1 : -1);
            const limit = isVertical ? (Math.abs(directionStraight) / 8) : (Math.abs(directionStraight));
    
            let currentId = startId + step;
            
            for (let i = 1; i < limit; i++) {
                if (document.getElementById(currentId).querySelector(".ChessPiece"))
                    return false;
                
                currentId += step;
            }
    
            return true;
        }
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }
}

class King extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;
        
        const step = endId - startId;

        //Valid king moves grouped into one big bit list
        const validSteps = 0b1110000010;
        return (validSteps >> Math.min(31, Math.abs(step))) & 1;
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }
}