// index.js
// Get all chess piece elements
const chessPieces = document.querySelectorAll('.ChessPiece');
const chessSquares = document.querySelectorAll('.ChessSquare');
function pieceCaptureOrMove(square,piece){
    if(square.firstChild!=null){

        if(square.id[0]!=piece.id[0])
        {
            square.removeChild(square.firstChild);
            square.appendChild(piece);
            
        }
    }
   else {
    square.appendChild(piece);
   }
    
}
// Add event listeners for drag-and-drop
function setup(){
    chessPieces.forEach((piece) => {
        piece.setAttribute('draggable', true);
        
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', piece.id); // store the piece ID
            console.log(piece.id);
        });
    });

    chessSquares.forEach((square) => {
        square.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        square.addEventListener('drop', (e) => {
            e.preventDefault();
            // Get the piece ID from the data transfer
            console.log(square.firstChild);
            console.log(square.id);
            const pieceId = e.dataTransfer.getData('text');
            const piece = document.getElementById(pieceId);
    
            // Append the piece to the new square
            pieceCaptureOrMove(square, piece);
        });
    });
}


window.addEventListener('DOMContentLoaded', (e) => {
    setup();
});
