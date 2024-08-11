//All of 'query selectors' or 'get elements'
const chessBoard = document.querySelector('.ChessBoard');
const chessTurn  = document.querySelector('.ChessTurn');

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
function isSquareUnderAttack(endSquareId, opponentColor) {
    const attackingPieces = document.querySelectorAll(`.ChessPiece[id^=${opponentColor}]`);
    
    for (const piece of attackingPieces) {
        const pieceId = piece.id;
        const pieceType = PIECE_CONFIG[pieceId];

        if (pieceType.canAttackSquare(piece.parentElement.id, endSquareId, opponentColor)) {
            return true;
        }
    }

    return false;
}

function isKingInCheck(kingColor, opponentColor) {
    const king         = document.querySelector(`.ChessPiece[id=${opponentColor}K1]`);
    const kingSquareId = king.parentElement.id;

    return isSquareUnderAttack(kingSquareId, kingColor);
}

function isLegalMove(startSquare, endSquare, piece, opponentColor) {
    const pieceColor = piece.id[0];
    
    //Simulate the move
    const originalEndSquarePiece = endSquare.querySelector('.ChessPiece');
    originalEndSquarePiece ? endSquare.replaceChild(piece, originalEndSquarePiece) : endSquare.appendChild(piece);

    //Check if the king would be in check after the move
    const isKingInCheckAfterMove = isKingInCheck(opponentColor, pieceColor);

    //Revert the move
    startSquare.appendChild(piece);
    if (originalEndSquarePiece)
        endSquare.appendChild(originalEndSquarePiece);

    //If the king is in check, disallow the move
    return !isKingInCheckAfterMove;
}

function pieceCaptureOrMove(startSquare, endSquare, piece) {
    const pieceColor = piece.id[0];
    const pieceType  = piece.id[1];
    //Check if the piece is of correct color (according to piece turn)
    if(pieceCurrentTurn !== pieceColor)
        return;

    const existingPiece = endSquare.querySelector(".ChessPiece");
    const opponentColor = pieceColor === 'W' ? 'B' : 'W';

    if(PIECE_CONFIG[piece.id].validateMovement(startSquare.id, endSquare.id, pieceColor))
    {
        if(!isLegalMove(startSquare, endSquare, piece, opponentColor))
            return;
        // if(pieceType === 'K') {
        //     if(isSquareUnderAttack(endSquare.id, opponentColor)) {
        //         return;
        //     }
        // }
        if(existingPiece) {
            if (existingPiece.id[0] !== pieceColor) {
                endSquare.replaceChild(piece, existingPiece);
                switchTurns();
            }
        }
        else {
            endSquare.appendChild(piece);
            switchTurns();
        }
        
        removeHighlights();
        highlightSquares(startSquare, endSquare);
    }
}

// Add event listeners for drag-and-drop
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

function restartGame() {
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