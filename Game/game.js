//All of 'query selectors' or 'get elements'
const chessBoard      = document.querySelector('.ChessBoard');
const chessTurn       = document.querySelector('.ChessTurn');
const checkmateScreen = document.querySelector('.ChessCheckmateScreen');

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

//Stores the starting square for each piece which moves
let pieceStartingSquare = null;
let pieceCurrentTurn = 'W';
let checkingPiece = null;

//----------Helper Functions----------
function removeHighlights() {
    document.querySelector(".ChessSquareHighlightS")?.classList.remove("ChessSquareHighlightS");
    document.querySelector(".ChessSquareHighlightE")?.classList.remove("ChessSquareHighlightE");
}

function highlightSquares(startSquare, endSquare) {
    startSquare.classList.add('ChessSquareHighlightS');
    endSquare.classList.add('ChessSquareHighlightE');
}

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
                rank.innerHTML = row;
                
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
            const piece = CHESS_PIECE_ARRANGEMENT[row][col]

            if(piece)
                square.appendChild(PIECE_CONFIG[piece].render());

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

//----------All functions to check if king in check or checkmate----------
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

function getPossibleKingMoves(kingSquare, kingColor) {
    const kingPosition = +kingSquare;
    const kingPossibleMoves = [
        kingPosition + 8,
        kingPosition - 8,
        kingPosition + 1,
        kingPosition - 1,
        kingPosition + 9,
        kingPosition - 9,
        kingPosition + 7,
        kingPosition - 7,
    ];

    return kingPossibleMoves.filter((value) => {
        //Bound checking: king should not go out of board
        if(value > 63 || value < 0)
            return false;
        
        const anotherPieceAtPosition = document.getElementById(value)?.querySelector(".ChessPiece");
        //Either another piece shouldn't exist, or even if it does, it shouldn't be of same color as king
        if(!anotherPieceAtPosition)
            return true;

        return (anotherPieceAtPosition.id[0] !== kingColor);
    });
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

    while (currentRow !== rowEnd || currentCol !== colEnd) {
        squaresBetween.push(currentRow * 8 + currentCol);
        //For debugging purposes
        // document.getElementById(currentRow * 8 + currentCol).classList.add("ChessSquareHighlightE");
        currentRow += rowStep;
        currentCol += colStep;
    }

    return squaresBetween;
}

function isCheckmate(kingColor, opponentColor) {
    //Get the king and its square
    const king       = document.querySelector(`.ChessPiece[id=${kingColor}K1]`);
    const kingSquare = king.parentElement.id;

    // 3 steps to check 'checkmate':
    // 1) Can king move out of the way
    // 2) Can piece checking king be 'captured'
    // 3) Can pathway of piece checking king be blocked
    
    //----------STEP 1----------
    const possibleMoves = getPossibleKingMoves(kingSquare, kingColor);
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

//----------Piece capturing / moving logic----------
function isLegalMove(startSquare, endSquare, piece, opponentColor) {
    const pieceColor = piece.id[0];
    
    //Simulate the move
    const originalEndSquarePiece = endSquare.querySelector('.ChessPiece');
    originalEndSquarePiece ? endSquare.replaceChild(piece, originalEndSquarePiece) : endSquare.appendChild(piece);

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
    checkmateScreen.classList.add("active");
    //Checkmate message
    checkmateScreen.getElementsByClassName("ChessCheckmateMessage")[0].innerHTML = `${pieceCurrentTurn === 'W' ? "Black" : "White"} Won!`;
}

function pieceCaptureOrMove(startSquare, endSquare, piece) {
    const pieceColor = piece.id[0];

    //Check if the piece is of correct color (according to piece turn)
    if(pieceCurrentTurn !== pieceColor)
        return;

    const existingPiece = endSquare.querySelector(".ChessPiece");
    const opponentColor = pieceColor === 'W' ? 'B' : 'W';

    if(PIECE_CONFIG[piece.id].validateMovement(startSquare.id, endSquare.id, pieceColor))
    {
        if(!isLegalMove(startSquare, endSquare, piece, opponentColor))
            return;

        if(existingPiece) {
            if (existingPiece.id[0] !== pieceColor) {
                checkingPiece = null;
                endSquare.replaceChild(piece, existingPiece);
                switchTurns();
            }
        }
        else {
            endSquare.appendChild(piece);
            switchTurns();
        }

        const kingInCheck = isKingInCheck(opponentColor, pieceColor);
        //If the king is in check, see if it's a checkmate or not
        if(kingInCheck) {
            const kingInCheckmate = isCheckmate(opponentColor, pieceColor);
            //For now show the checkmate screen
            if(kingInCheckmate)
                showCheckmateScreen();
        }

        removeHighlights();
        highlightSquares(startSquare, endSquare);
    }
}

//----------Add event listeners for drag-and-drop-----------
function setupDragDropEvents() {
    const chessPieces  = document.querySelectorAll('.ChessPiece');
    const chessSquares = document.querySelectorAll('.ChessSquare');

    chessPieces.forEach((piece) => {
        piece.setAttribute('draggable', true);
        
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('pieceId', piece.id); //Store the piece ID
            pieceStartingSquare = piece.parentElement;
        });
    });

    chessSquares.forEach((pieceEndingSquare) => {
        pieceEndingSquare.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        pieceEndingSquare.addEventListener('drop', (e) => {
            e.stopPropagation();
            //Get the piece ID from the data transfer
            const pieceId = e.dataTransfer.getData('pieceId');
            const piece   = document.getElementById(pieceId);

            //Append the piece to the new pieceEndingSquare if valid
            pieceCaptureOrMove(pieceStartingSquare, pieceEndingSquare, piece);
        });
    });
}

//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to reload?"))
        location.reload();
}

function quitGame(){
    if(confirm("Would you really like to quit?"))
        window.close();
}

//----------EVENT LISTENERS FOR DOCUMENTS AND WINDOWS----------
window.addEventListener('DOMContentLoaded', (e) => {
    setupChessBoard();
    setupDragDropEvents();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        location.reload();
    }
});