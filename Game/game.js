//Get all chess piece elements
const chessPieces = document.querySelectorAll('.ChessPiece');
const chessSquares = document.querySelectorAll('.ChessSquare');

function pieceCaptureOrMove(square, piece) {
    const existingPiece = square.querySelector(".ChessPiece");

    console.log(existingPiece);

    if(existingPiece) {
        if (existingPiece.id[0] !== piece.id[0]) {
            square.replaceChild(piece, existingPiece);
        }
    }
    else {
        square.appendChild(piece);
    }
}

//Add event listeners for drag-and-drop
function setup() {
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

window.addEventListener('DOMContentLoaded', (e) => {
    setup();
});

function restartGame(){
    location.reload();
}

function quitGame(){
    if(confirm("do you wanna quit fr ong?"))
    window.close();
}
