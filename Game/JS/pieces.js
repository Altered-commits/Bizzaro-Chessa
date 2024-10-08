class ChessPiece {
    constructor(id) {
        this.id = id
    }

    render() {
        const pieceDiv = document.createElement("div");
        
        pieceDiv.classList.add("ChessPiece");
        pieceDiv.id        = this.id;
        pieceDiv.innerHTML = `<img src='/Game/ChessPiecesPng/${this.id.slice(0, -1)}.png'>`

        return pieceDiv;
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
        pieceMovements.forEach((step) => {
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
        //If the piece is at the end most columns, diagonalLeft or diagonalRight will be -1. Basically, wrap checking
        const diagonalLeft  = (startId % 8 !== 0) ? startId + (direction === 1 ? -9 : 7) : -1;
        const diagonalRight = (startId % 8 !== 7) ? startId + (direction === 1 ? -7 : 9) : -1;
        
        //Forward movement one block
        if((endId == forwardOne) && !document.getElementById(forwardOne).querySelector(".ChessPiece")) {
            this.startingPawnMovement = false;
            this.canEnPassantCapture  = false;
            return true;
        }
        
        //Diagonal capture
        if(((endId == diagonalLeft) || (endId == diagonalRight)) && document.getElementById(endId).querySelector(".ChessPiece")) {
            this.startingPawnMovement = false;
            this.canEnPassantCapture  = false;
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
        if(this.startingPawnMovement && !fwdSqrOccupied && !document.getElementById(forwardTwo)?.querySelector(".ChessPiece"))
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

    resetState() {
        this.startingPawnMovement = true;
    }
}

class Rook extends ChessPiece
{
    constructor(id) {
        super(id);
        this.hasNotMoved = true;
    }

    validateMovement(startingSquare, endingSquare, _pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        //Determine the direction of movement
        const direction = (endId - startId);
        
        // Check if the move is horizontal or vertical
        const isVertical = (startId % 8 === endId % 8);
        const isHorizontal = (Math.floor(startId / 8) === Math.floor(endId / 8));
        
        if (!(isVertical || isHorizontal))
            return false; //Rook can only move in straight lines

        //Determine the step direction
        const step = isVertical ? (endId > startId ? 8 : -8) : (endId > startId ? 1 : -1);
        const limit = isVertical ? (Math.abs(direction) / 8) : (Math.abs(direction));

        let currentId = startId + step;
        
        for (let i = 1; i < limit; i++) {
            if (document.getElementById(currentId).querySelector(".ChessPiece"))
                return false;

            currentId += step;
        }

        //It can properly move, set hasNotMoved to false
        this.hasNotMoved = false;
        return true;
    }

    canAttackSquare(startingSquare, endingSquare, pieceColor) {
        return this.validateMovement(startingSquare, endingSquare, pieceColor);
    }

    getPossibleMoves(startingSquare, pieceColor) {
        return this.getPossibleCustomMoves(startingSquare, pieceColor, [-8, 8, -1, 1]);
    }

    resetState() {
        this.hasNotMoved = true;
    }
}

class Bishop extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, _pieceColor) {
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

    resetState() {}
}

class Knight extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, _pieceColor) {
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

    resetState() {}
}

class Queen extends ChessPiece
{
    validateMovement(startingSquare, endingSquare, _pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;

        //Determine the direction of movement
        const directionStraight = (endId - startId);
        
        // Check if the move is horizontal or vertical
        const isVertical   = (startId % 8 === endId % 8);
        const isHorizontal = (Math.floor(startId / 8) === Math.floor(endId / 8));

        const startRow = Math.floor(startId / 8);
        const startCol = startId % 8;
        const endRow   = Math.floor(endId / 8);
        const endCol   = endId % 8;

        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);

        if ((!isVertical && !isHorizontal && (rowDiff !== colDiff)))
            return false;
        
        if ((rowDiff === colDiff)){ 
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

    resetState() {}
}

class King extends ChessPiece
{
    constructor(id) {
        super(id);
        this.hasNotMoved = true;
    }

    validateMovement(startingSquare, endingSquare, pieceColor) {
        const startId = +startingSquare;
        const endId   = +endingSquare;        
        const step    = endId - startId;

        //Check for castling conditions
        if(Math.abs(step) === 2 && this.hasNotMoved)
            return this.canCastle(startId, step, pieceColor);

        //Valid king moves grouped into one big bit list
        const validSteps = 0b1110000010;
        const isValidMove = (validSteps >> Math.min(31, Math.abs(step))) & 1;

        if(!isValidMove) return false;

        //Wrap check so it doesn't wrap around edges
        const isNotWrapping = this.wrapCheck(startId, endId, 1);

        //Valid move
        if(isNotWrapping) {
            this.hasNotMoved = false;
            return true;
        }

        return false;
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

        const filteredMoves = kingPossibleMoves.filter((value) => {
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

        //Castling moves are also allowed at this point
        if(this.hasNotMoved) {
            //Queen side castling
            const queenSideCastle = kingSquareId - 2;
            const kingSideCastle  = kingSquareId + 2;
            //King side castling possible
            if(this.canCastle(kingSquareId, 2, pieceColor, false))
                filteredMoves.push(kingSideCastle);

            if(this.canCastle(kingSquareId, -2, pieceColor, false))
                filteredMoves.push(queenSideCastle);
        }

        return filteredMoves;
    }

    canCastle(startId, step, pieceColor, shouldChangeMovedFlag = true) {
        const stepTowardsQueen = step === -2;
        
        //Either Queen side Rook or King side Rook (either white or black piece)
        const rook = stepTowardsQueen ? `${pieceColor}R1` : `${pieceColor}R2`;

        //Check if the Rook has moved or not
        if(!PIECE_CONFIG[rook].hasNotMoved)
            return false;

        //Check if no pieces exist in between Rook and King
        const stepSquare  = stepTowardsQueen ? -1 : 1;
        let   startSquare = startId + stepSquare;
        const endSquare   = stepTowardsQueen ? (startId - 3) : (startId + 2);

        while(startSquare !== endSquare) {
            //See if the square is occupied by another piece or nah
            const piece = document.getElementById(startSquare).querySelector(".ChessPiece");
            if(piece)
                return false;

            startSquare += stepSquare;
        }
        
        //If we want to, we change the hasNotMoved flag (by default we do it)
        if(shouldChangeMovedFlag)
            this.hasNotMoved = false;
        
        //We can castle
        return true;
    }

    resetState() {
        this.hasNotMoved = true;
    }
}