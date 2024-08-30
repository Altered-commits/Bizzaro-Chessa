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

    getPossibleMoves(startingSquare, pieceColor) {
        return [];
    }

    //Internal function
    wrapCheck(startId, endId, limit) {
        //Boundary check for rows and columns
        const startRow = Math.floor(startId / 8);
        const endRow = Math.floor(endId / 8);
        const startCol = startId % 8;
        const endCol = endId % 8;

        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);

        //Diagonal entries
        if (limit === 9 || limit === 7) {
            return rowDiff === colDiff;
        }
        //Rest of the entries
        return rowDiff <= limit && colDiff <= limit;
    }

    //Used by Rook, Bishop and Queen
    getPossibleCustomMoves(startingSquare, pieceColor, pieceMovements) {
        const startId = +startingSquare;
        const possibleMoves = [];
        
        //Directions for Rook: up, down, left, right
        const directions = pieceMovements;
        
        directions.forEach((step) => {
            let currentId = startId + step;
            let absStep   = Math.abs(step);
            
            while (currentId >= 0 && currentId < 64 && this.wrapCheck(currentId - step, currentId, absStep)) {
                const pieceAtPosition = document.getElementById(currentId)?.querySelector(".ChessPiece");

                if (pieceAtPosition) {
                    if (pieceAtPosition.id[0] !== pieceColor) {
                        possibleMoves.push(currentId);
                    }
                    break; //Stop if another piece is in the way
                }
                else
                    possibleMoves.push(currentId);
                
                currentId += step;
            }
        });

        return possibleMoves;
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
        //If the piece is at the end most columns, diagonalLeft or diagonalRight will be -1
        //Basically, wrap checking
        const diagonalLeft = (startId % 8 !== 0)
                            ? startId + (direction === 1 ? -9 : 7)
                            : -1;

        const diagonalRight = (startId % 8 !== 7)
                            ? startId + (direction === 1 ? -7 : 9)
                            : -1;

        //Forward movement one block
        if((endId == forwardOne) && !document.getElementById(forwardOne).querySelector(".ChessPiece")) {
            this.startingPawnMovement = false;
            return true;
        }
        
        //Diagonal capture
        if(((endId == diagonalLeft) || (endId == diagonalRight)) && document.getElementById(endId).querySelector(".ChessPiece")) {
            //Always set this to false
            this.startingPawnMovement = false;
            return true;
        }
        
        //Forward movement two blocks only if its first move
        if(this.startingPawnMovement && (endId == forwardTwo)) {
            let hindrancePieces = !document.getElementById(forwardOne).querySelector(".ChessPiece") &&
                                  !document.getElementById(forwardTwo).querySelector(".ChessPiece");
            
            this.startingPawnMovement = hindrancePieces ? false : true;
            return hindrancePieces;
        }

        return false;
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

    getPossibleMoves(startingSquare, pieceColor) {
        const startId       = +startingSquare;
        const direction     = pieceColor === 'W' ? 1 : -1;
        const possibleMoves = [];

        const forwardOne    = startId - 8 * direction;
        const forwardTwo    = startId - 16 * direction;
        //With wrap checking
        const diagonalLeft  = (startId % 8 !== 0) ? startId + (direction === 1 ? -9 : 7) : -1;
        const diagonalRight = (startId % 8 !== 7) ? startId + (direction === 1 ? -7 : 9) : -1;
        
        const fwdSqrOccupied = document.getElementById(forwardOne)?.querySelector(".ChessPiece");
        
        //Forwards
        if(!fwdSqrOccupied)
            possibleMoves.push(forwardOne);
        if(!fwdSqrOccupied && !document.getElementById(forwardTwo)?.querySelector(".ChessPiece"))
            possibleMoves.push(forwardTwo);
        //Diagonals
        if(diagonalLeft > -1) {
            const diagonalLeftOccupied = document.getElementById(diagonalLeft)?.querySelector(".ChessPiece");
            if (diagonalLeftOccupied && diagonalLeftOccupied.id[0] !== pieceColor)
                possibleMoves.push(diagonalLeft);
        }
        if(diagonalRight > -1) {
            const diagonalRightOccupied = document.getElementById(diagonalRight)?.querySelector(".ChessPiece");
            if (diagonalRightOccupied && diagonalRightOccupied.id[0] !== pieceColor)
                possibleMoves.push(diagonalRight);
        }

        return possibleMoves;
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

    getPossibleMoves(startingSquare, pieceColor) {
        return this.getPossibleCustomMoves(startingSquare, pieceColor, [-8, 8, -1, 1]);
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

    getPossibleMoves(startingSquare, pieceColor) {
        return this.getPossibleCustomMoves(startingSquare, pieceColor, [-9, -7, 7, 9]);
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
        const isValidMove = (validSteps >> Math.min(31, Math.abs(step))) & 1;

        if(!isValidMove) return false;

        //Wrap check
        return this.wrapCheck(startId, endId, 2);
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }

    getPossibleMoves(startingSquare, pieceColor) {
        const startId = +startingSquare;
        const possibleMoves = [
            startId + 17, startId + 15,
            startId + 10, startId + 6,
            startId - 17, startId - 15,
            startId - 10, startId - 6
        ];

        return possibleMoves.filter(move => {
            //Bound checking
            if (move < 0 || move >= 64) return false;

            const rowDiff = Math.abs(Math.floor(startId / 8) - Math.floor(move / 8));
            const colDiff = Math.abs((startId % 8) - (move % 8));

            if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
                const piece = document.getElementById(move)?.querySelector(".ChessPiece");
                return !piece || piece.id[0] !== pieceColor;
            }
            return false;
        });
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

    getPossibleMoves(startingSquare, pieceColor) {
        return this.getPossibleCustomMoves(startingSquare, pieceColor, [-8, 8, -1, 1, -9, -7, 7, 9]);
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
        const isValidMove = (validSteps >> Math.min(31, Math.abs(step))) & 1;

        if(!isValidMove) return false;

        //Wrap check
        return this.wrapCheck(startId, endId, 1);
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }

    getPossibleMoves(startingSquare, pieceColor) {
        const kingSquareId      = +startingSquare;
        const kingPossibleMoves = [
            kingSquareId + 8,
            kingSquareId - 8,
            kingSquareId + 1,
            kingSquareId - 1,
            kingSquareId + 9,
            kingSquareId - 9,
            kingSquareId + 7,
            kingSquareId - 7,
        ];

        return kingPossibleMoves.filter((value) => {
            //Bound checking - 1: king should not go out of the board
            if(value > 63 || value < 0)
                return false;

            //Bound checking - 2: King should not wrap around the board
            if(!this.wrapCheck(kingSquareId, value, 1))
                return false;

            const anotherPieceAtPosition = document.getElementById(value)?.querySelector(".ChessPiece");
            //Either another piece shouldn't exist, or even if it does, it shouldn't be of same color as king
            if(!anotherPieceAtPosition)
                return true;

            return (anotherPieceAtPosition.id[0] !== pieceColor);
        });
    }
}