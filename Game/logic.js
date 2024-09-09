//All of 'query selectors'
const chessBoard    = document.querySelector('.ChessBoard');
const chessTurn     = document.querySelector('.ChessTurn');
const gameEndScreen = document.querySelector('.GameEndScreen');

//Audio
const pieceMovementAudio = new Audio("../SFX/PieceMovementAudio.mp3");

//Chess constants
const CHESS_WIDTH = 8;
const CHESS_PIECE_ARRANGEMENT = [
    ["BR1", "BN1", "BB1", "BQ1", "BK1", "BB2", "BN2", "BR2"],
    ["BP1", "BP2", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8"],
    [],
    [],
    [],
    [],
    ["WP1", "WP2", "WP3", "WP4", "WP5", "WP6", "WP7", "WP8"],
    ["WR1", "WN1", "WB1", "WQ1", "WK1", "WB2", "WN2", "WR2"]
];
const PIECE_CONFIG = {
    "BR1": new Rook("BR1"), "BN1": new Knight("BN1"), "BB1": new Bishop("BB1"), "BQ1": new Queen("BQ1"), "BK1": new King("BK1"), "BB2": new Bishop("BB2"), "BN2": new Knight("BN2"), "BR2": new Rook("BR2"),
    "BP1": new Pawn("BP1"), "BP2": new Pawn("BP2"), "BP3": new Pawn("BP3"), "BP4": new Pawn("BP4"), "BP5": new Pawn("BP5"), "BP6": new Pawn("BP6"), "BP7": new Pawn("BP7"), "BP8": new Pawn("BP8"),
    "WR1": new Rook("WR1"), "WN1": new Knight("WN1"), "WB1": new Bishop("WB1"), "WQ1": new Queen("WQ1"), "WK1": new King("WK1"), "WB2": new Bishop("WB2"), "WN2": new Knight("WN2"), "WR2": new Rook("WR2"),
    "WP1": new Pawn("WP1"), "WP2": new Pawn("WP2"), "WP3": new Pawn("WP3"), "WP4": new Pawn("WP4"), "WP5": new Pawn("WP5"), "WP6": new Pawn("WP6"), "WP7": new Pawn("WP7"), "WP8": new Pawn("WP8")
};
//Used for pawn promotion
const PROMOTION_COUNTER = {
    "WQ": 3, "WR": 3, "WB": 3, "WN": 3,
    "BQ": 3, "BR": 3, "BB": 3, "BN": 3
};

//Some data which can be changed
let pieceStartingSquare = null;
let pieceMovableSquares = []
let pieceCurrentTurn    = 'W';
let checkingPiece       = null;
//Dynamically calculate total pieces
let totalPieces = CHESS_PIECE_ARRANGEMENT.reduce((acc, row) => {
    return acc + row.length;
}, 0);

//----------Chess setup----------
function setupChessBoard() {
    let invertColor = 1;

    for (let row = 0; row < CHESS_WIDTH; row++) {
        for (let col = 0; col < CHESS_WIDTH; col++) {
            //Create a square
            const square = document.createElement("div");
            square.classList.add("ChessSquare");
            
            //Each square gets it's own unique id
            const nid = ((row * CHESS_WIDTH) + col);
            square.id = nid;
            
            //Square colors decided here
            if ((row + col) % 2 === 0)
                square.classList.add("White");
            else
                square.classList.add("Black");
            
            //Adding ranks
            if(nid % 8 === 0) {
                const rank = document.createElement("div");

                rank.classList.add("ChessSquareNumber");
                rank.classList.add(invertColor === 1 ? "BlackNumber" : "WhiteNumber");
                rank.innerHTML = row + 1;
                
                square.append(rank);
                
                //Invert color
                invertColor = invertColor ^ 1;
            }

            //Adding files
            if(nid > 55) {
                const file = document.createElement("div");

                file.classList.add("ChessSquareLetter");
                file.classList.add(invertColor === 0 ? "BlackNumber" : "WhiteNumber");
                file.innerHTML = String.fromCharCode(nid + 41); //ascii of 'a' starts from 97 hence the offset (+ 41)

                square.append(file);
                
                //Invert color
                invertColor = invertColor ^ 1;
            }
            
            //Add pieces to square if they exist
            const pieceId = CHESS_PIECE_ARRANGEMENT[row][col]

            if(pieceId)
                square.appendChild(PIECE_CONFIG[pieceId].render());

            //Finally append the completed square
            chessBoard.append(square);
        }
    }
}

//----------All functions regarding chess rules----------
function switchTurns() {
    if(pieceCurrentTurn === 'W') {
        pieceCurrentTurn = 'B';
        chessTurn.innerHTML = `Black's Turn`
    }
    else {
        pieceCurrentTurn = 'W';
        chessTurn.innerHTML = `White's Turn`
    }
}

//----------All functions to check if (king in check or checkmate) or stalemate----------
function isSquareUnderAttack(endSquareId, opponentColor, isKing) {
    const attackingPieces = document.querySelectorAll(`.ChessPiece[id^=${opponentColor}]`);
    
    for (const piece of attackingPieces) {
        const pieceId = piece.id;
        const pieceType = PIECE_CONFIG[pieceId];

        if (pieceType.canAttackSquare(piece.parentElement.id, endSquareId, opponentColor)) {
            if(isKing)
                checkingPiece = piece;
            return true;
        }
    }

    return false;
}

function isKingInCheck(kingColor, opponentColor) {
    const king         = document.querySelector(`.ChessPiece[id=${kingColor}K1]`);
    const kingSquareId = king.parentElement.id;

    return isSquareUnderAttack(kingSquareId, opponentColor, true);
}

function getSquaresBetween(startSquare, endSquare) {
    const squaresBetween = [];

    const startSquareId = +startSquare;
    const endSquareId   = +endSquare;

    const rowStart = Math.floor(startSquareId / 8);
    const colStart = startSquareId % 8;
    const rowEnd = Math.floor(endSquareId / 8);
    const colEnd = endSquareId % 8;

    const rowStep = rowEnd > rowStart ? 1 : (rowEnd < rowStart ? -1 : 0);
    const colStep = colEnd > colStart ? 1 : (colEnd < colStart ? -1 : 0);

    let currentRow = rowStart + rowStep;
    let currentCol = colStart + colStep;

    //Invalid diagonal move
    if (Math.abs(rowEnd - rowStart) !== Math.abs(colEnd - colStart) && (rowStep !== 0 && colStep !== 0))
        return [];

    while (currentRow !== rowEnd || currentCol !== colEnd) {
        squaresBetween.push(currentRow * 8 + currentCol);

        currentRow += rowStep;
        currentCol += colStep;
    }

    return squaresBetween;
}

function isCheckmate(kingColor, opponentColor) {
    //Get the king and its square
    const king       = document.querySelector(`.ChessPiece[id=${kingColor}K1]`);
    const kingPiece  = PIECE_CONFIG[king.id];
    const kingSquare = king.parentElement.id;

    // 3 steps to check 'checkmate':
    // 1) Can king move out of the way
    // 2) Can piece checking king be 'captured'
    // 3) Can pathway of piece checking king be blocked
    
    //----------STEP 1----------
    const possibleMoves = kingPiece.getPossibleMoves(kingSquare, kingColor);
    for(const move of possibleMoves) {
        const startSquare = king.parentElement;
        const endSquare   = document.getElementById(move);
        
        //Even if one move exists which is legal, we know that it can't be checkmate
        if(isLegalMove(startSquare, endSquare, king, opponentColor))
            return false;
    }

    //----------STEP 2----------
    const allyPieces = document.querySelectorAll(`.ChessPiece[id^=${kingColor}]:not([id$='K1'])`);
    for (const allyPiece of allyPieces) {
        //Even if one ally piece can attack the piece checking 'king', return false
        const pieceType   = PIECE_CONFIG[allyPiece.id];
        const startSquare = allyPiece.parentElement.id;
        const endSquare   = checkingPiece.parentElement.id;
        
        //If any one piece can capture the checking piece, then its not checkmate
        if(pieceType.validateMovement(startSquare, endSquare, kingColor))
            return false;
    }

    //----------STEP 3----------
    const squaresBetween = getSquaresBetween(checkingPiece.parentElement.id, king.parentElement.id);

    for (const allyPiece of allyPieces) {
        const pieceType   = PIECE_CONFIG[allyPiece.id];
        const startSquare = allyPiece.parentElement.id;

        //Check if ally pieces can block atleast one square (excluding king ofc)
        for (const square of squaresBetween) {
            if(pieceType.validateMovement(startSquare, square, kingColor))
                return false;
        }
    }

    //Checkmate
    return true;
}

function isStalemate(pieceColor) {
    //Get all pieces of the pieceColor
    const pieces = document.querySelectorAll(`.ChessPiece[id^=${pieceColor}]`);

    //For each piece, get it's piece config and check for valid moves, if no valid move, stalemate occurs
    for (const piece of pieces) {
        const startSquare   = piece.parentElement;
        const possibleMoves = PIECE_CONFIG[piece.id].getPossibleMoves(startSquare.id, pieceColor);

        for (const move of possibleMoves) {
            if(isLegalMove(startSquare, document.getElementById(move), piece, pieceColor === 'W' ? 'B' : 'W'))
                return false;
        }
    }

    return true;
}

//----------Piece capturing and moving logic----------
function isLegalMove(startSquare, endSquare, piece, opponentColor) {
    const pieceColor = piece.id[0];
    
    //Simulate the move
    const originalEndSquarePiece = endSquare.querySelector('.ChessPiece');
    //Trying to capture the same colored piece
    if(originalEndSquarePiece) {
        if(originalEndSquarePiece.id[0] === pieceColor)
            return false;
        //If it isn't same colored piece, replace the child with our piece
        endSquare.replaceChild(piece, originalEndSquarePiece);
    }
    else 
        endSquare.appendChild(piece);

    //Check if the king would be in check after the move
    const isKingInCheckAfterMove = isKingInCheck(pieceColor, opponentColor);

    //Revert the move
    startSquare.appendChild(piece);
    if (originalEndSquarePiece)
        endSquare.appendChild(originalEndSquarePiece);

    //If the king is in check, disallow the move
    return !isKingInCheckAfterMove;
}

function showCheckmateScreen()
{
    //First child is 'type' and second child is 'message'
    checkmateContainer = gameEndScreen.children;
    checkmateContainer[0].innerHTML = "CHECKMATE";
    checkmateContainer[1].innerHTML = `!${pieceCurrentTurn === 'W' ? "Black" : "White"} Won!`;

    //Finally display the message
    gameEndScreen.classList.add("active");
}

function showStalemateScreen() {
    //If the GameEndScreen already exists, then don't do anything
    if(!gameEndScreen.classList.contains("active"))
        //By default it shows the stalemate message
        gameEndScreen.classList.add("active");
}

function afterPieceMovement() {
    //Play the audio for piece movement
    pieceMovementAudio.play().catch(error => {
        console.error("Error playing audio:", error);
    });

    //We switch turns
    switchTurns();
}

//Update the game state (check, checkmate, stalemate)
function updateGameState(opponentColor, pieceColor) {
    //If the king is in check, check for checkmate
    if (isKingInCheck(opponentColor, pieceColor)) {
        if (isCheckmate(opponentColor, pieceColor)) {
            showCheckmateScreen();
        }
    } else if (totalPieces < 12) { //Delay stalemate check until less than 12 pieces remain
        if (isStalemate(opponentColor)) {
            showStalemateScreen();
        }
    }
}

function moveOrCapture(endSquare, piece) {
    const existingPiece = endSquare.querySelector(".ChessPiece");

    if(existingPiece) {
        const pieceType     = existingPiece.id[1];
        const pieceNumber   = +existingPiece.id[2];

        //If the number is gteq 3 and it is not a pawn, then we delete it's entry from PIECE_CONFIG
        if(pieceNumber >= 3 && pieceType !== 'P')
            delete PIECE_CONFIG[existingPiece.id];

        //Rest of the logic
        checkingPiece = null;
        endSquare.replaceChild(piece, existingPiece);
        totalPieces -= 1;
    }
    else
        endSquare.appendChild(piece);
}

//----------Special moves----------
function promotePawn(pawn, square) {
    const promotionChoice = prompt("Promote to: (Q)ueen, (R)ook, (B)ishop, (K)night").toUpperCase();
    let newPieceId = null;
    let newPiece   = null;
    
    switch (promotionChoice) {
        default:
        case 'Q':
            newPieceId = `${pawn.id[0]}Q${PROMOTION_COUNTER[`${pawn.id[0]}Q`]++}`;
            newPiece   = new Queen(newPieceId);
            break;
        case 'R':
            newPieceId = `${pawn.id[0]}R${PROMOTION_COUNTER[`${pawn.id[0]}R`]++}`;
            newPiece   = new Rook(newPieceId);
            break;
        case 'B':
            newPieceId = `${pawn.id[0]}B${PROMOTION_COUNTER[`${pawn.id[0]}B`]++}`;
            newPiece   = new Bishop(newPieceId);
            break;
        case 'K':
            newPieceId = `${pawn.id[0]}N${PROMOTION_COUNTER[`${pawn.id[0]}N`]++}`;
            newPiece   = new Knight(newPieceId);
            break;
    }
    
    //Add new piece to piece config
    PIECE_CONFIG[newPieceId] = newPiece;
    
    //Create the piece
    const renderedPiece = newPiece.render();
    
    //Add event listeners to the piece
    renderedPiece.setAttribute("draggable", true);
    renderedPiece.addEventListener("dragstart", handleDragStart);
    
    //And promote the pawn
    square.replaceChild(renderedPiece, pawn);
}

function checkSpecialMoves(endSquare, piece) {
    const endSquareId = +endSquare.id;

    const pieceType  = piece.id[1];
    const pieceColor = piece.id[0];

    const endRow  = Math.floor(endSquareId / 8);

    //If it's a pawn, check for two things
    //1) Pawn promotion
    //2) En Passant
    //If it's a king, check for castling

    switch (pieceType) {
        case 'P':
            if(endRow === (pieceColor === 'W' ? 0 : 7))
                promotePawn(piece, endSquare);
            break;
    }
}

//----------Main function checking and validating moves----------
function handleValidateCaptureOrMove(startSquare, endSquare, piece) {
    const pieceColor = piece.id[0];

    //Check if the piece is of correct color (according to piece turn)
    if(pieceCurrentTurn !== pieceColor) return;

    const opponentColor = pieceColor === 'W' ? 'B' : 'W';
    const pieceIdConfig = PIECE_CONFIG[piece.id];

    if(!pieceIdConfig.validateMovement(startSquare.id, endSquare.id, pieceColor)) return;
    
    if(!isLegalMove(startSquare, endSquare, piece, opponentColor)) return;

    moveOrCapture(endSquare, piece);
    checkSpecialMoves(endSquare, piece);
    afterPieceMovement();
    updateGameState(opponentColor, pieceColor);
}

//----------Add event listeners for drag-and-drop-----------
function handleDragStart(e) {
    const piece         = e.target.parentElement; //Get the piece
    const pieceId       = piece.id;               //Get the piece id
    const startSquare   = piece.parentElement;    //Get the square
    const squareId      = startSquare.id;         //Get the square id on which the piece currently is
    const pieceColor    = pieceId[0];
    const opponentColor = pieceColor === 'W' ? 'B' : 'W';

    //Marks the areas where the piece can move (global variable)
    pieceMovableSquares = PIECE_CONFIG[pieceId].getPossibleMoves(squareId, pieceColor);

    for(const movableSquare of pieceMovableSquares) {
        const endSquare = document.getElementById(movableSquare);
        
        if(isLegalMove(startSquare, endSquare, piece, opponentColor))
            endSquare.classList.add("ChessSquareHighlightE");
    }

    //Store the piece ID and it's starting square
    e.dataTransfer.setData('pieceId', pieceId);
    pieceStartingSquare = piece.parentElement;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.stopPropagation();

    //Remove highlights placed by the handleDragStart
    for(const movableSquare of pieceMovableSquares)
        document.getElementById(movableSquare).classList.remove("ChessSquareHighlightE");

    //Get the piece ID from the data transfer
    const pieceId = e.dataTransfer.getData('pieceId');
    const piece   = document.getElementById(pieceId);

    //Get the square where the piece is dropped
    const pieceEndingSquare = e.currentTarget;

    //Append the piece to the new pieceEndingSquare if valid
    handleValidateCaptureOrMove(pieceStartingSquare, pieceEndingSquare, piece);
}

function setupDragDropEvents() {
    const chessPieces  = document.querySelectorAll('.ChessPiece');
    const chessSquares = document.querySelectorAll('.ChessSquare');

    chessPieces.forEach((piece) => {
        piece.setAttribute('draggable', true);
        piece.addEventListener('dragstart', handleDragStart);
    });

    chessSquares.forEach((pieceEndingSquare) => {
        pieceEndingSquare.addEventListener('dragover', handleDragOver);
        pieceEndingSquare.addEventListener('drop', handleDrop);
    });
}

//----------Cleanup functions----------
function cleanupDragDropEvents() {
    const chessPieces = document.querySelectorAll('.ChessPiece');
    const chessSquares = document.querySelectorAll('.ChessSquare');

    chessPieces.forEach((piece) => {
        piece.removeEventListener('dragstart', handleDragStart);
    });

    chessSquares.forEach((square) => {
        square.removeEventListener('dragover', handleDragOver);
        square.removeEventListener('drop', handleDrop);
    });
}

function resetDomElements() {
    //Remove elements if they exist
    if (chessBoard) chessBoard.innerHTML = '';
    if (gameEndScreen) {
        //0th index contains 'type' and 1st index contains 'message'
        //By default we go with 'stalemate' screen
        gameEndScreen.children[0].innerHTML = 'STALEMATE';
        gameEndScreen.children[1].innerHTML = 'DRAW'

        //Remove it from screen
        gameEndScreen.classList.remove("active");
    }
}

function resetPieceConfig() {
    //Reset promotion counter to 3
    for (const key in PROMOTION_COUNTER)
        PROMOTION_COUNTER[key] = 3;

    //Reset piece config to remove promoted pieces
    for (const key in PIECE_CONFIG) {
        const pieceType = key[1];
        const pieceNum  = +key[2];

        if(pieceNum >= 3 && pieceType !== 'P')
            delete PIECE_CONFIG[key];
    }
}

function resetPieceStates() {
    for (const key in PIECE_CONFIG) {
        const pieceType = key[1];
        if(pieceType == 'P')
            PIECE_CONFIG[key].resetState();
    }
}