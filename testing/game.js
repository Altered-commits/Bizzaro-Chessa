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

function startGame(){
    const height=8;
    const width=8;
    document.getElementById("border").innerHTML +=`<div class="ChessBoard" id="board"> </div>`;
    for ( i =0 ;i<height;i++){
        document.getElementById("board").innerHTML +=`<div class="ChessRow" id="${i}">`;
        for ( j =0 ;j<width;j++){
            if ((i+j)%2==0){ 
                document.getElementById(`${i}`).innerHTML +=`<div class="ChessSquare White" id=${(i*height+j)}"> </div>`;
                console.log(`${(i*height+j)}`)
            }
            if ((i+j)%2!=0)  { document.getElementById(`${i}`).innerHTML +=`<div class="ChessSquare Black" id=${(i*height+j)}"> </div>`;}

        }
        document.getElementById("board").innerHTML +='</div>';
    }
    document.getElementById("buttons").innerHTML  +=`<button id ="restartButton" onclick="restartGame()">RESTART</button>`;
    document.getElementById("buttons").innerHTML  +=`<button id ="undoButton" onclick="undoMove()">UNDO</button>`;
    document.getElementById("buttons").innerHTML  +=`<button id ="quitButton" onclick="quitGame()">QUIT</button>`;
    document.getElementById("startButton").outerHTML  =``;
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault(); // Optional: prevent the default action if needed
        location.reload(); // Reload the page
    }
});