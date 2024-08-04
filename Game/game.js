//All of 'query selectors' or 'get elements'
const chessBoard = document.querySelector('.ChessBoard')

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

//----------Functions----------
function setupChessBoard()
{
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
            if ((row + col) % 2 === 0) {
                square.classList.add("White");
            } else {
                square.classList.add("Black");
            }
            
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

            if(piece) {
                const pieceDiv = document.createElement("div");

                pieceDiv.classList.add("ChessPiece");
                pieceDiv.id        = piece;
                pieceDiv.innerHTML = `<img src='ChessPiecesPng/${piece.slice(0, -1)}.png'>`;

                square.appendChild(pieceDiv);
            }

            chessBoard.append(square);
        }
    }
}

function pieceCaptureOrMove(square, piece) {
    const existingPiece = square.querySelector(".ChessPiece");

    if(existingPiece) {
        if (existingPiece.id[0] !== piece.id[0]) {
            square.replaceChild(piece, existingPiece);
        }
    }
    else {
        square.appendChild(piece);
    }
}

// Add event listeners for drag-and-drop
function setupDragDropEvents() {
    const chessPieces  = document.querySelectorAll('.ChessPiece');
    const chessSquares = document.querySelectorAll('.ChessSquare');

    chessPieces.forEach((piece) => {
        piece.setAttribute('draggable', true);
        
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', piece.id); //Store the piece ID
        });
    });

    chessSquares.forEach((square) => {
        square.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        square.addEventListener('drop', (e) => {
            e.preventDefault();
            //Get the piece ID from the data transfer
            const pieceId = e.dataTransfer.getData('text');
            const piece = document.getElementById(pieceId);
            
            //Append the piece to the new square
            pieceCaptureOrMove(square, piece);
        });
    });
}

function restartGame() {
    location.reload();
}

function quitGame() {
    if(confirm("do you wanna quit fr ong?"))
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