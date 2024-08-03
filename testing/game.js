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
    document.getElementById("border").innerHTML +=`<div class="ChessBoard" id="board"> </div>`;//adding board so it looks clean when start is not pressed

    for ( i =0 ;i<height;i++){
        document.getElementById("board").innerHTML +=`<div class="ChessRow" id="row${i}"></div>`;//adding chessrow one by one
        for ( j =0 ;j<width;j++){

            if ((i+j)%2==0){ 
                document.getElementById(`row${i}`).innerHTML +=`<div class="ChessSquare White" id="square${i*height+j}"> </div>`;
                console.log(`${(i*height+j)}`)//white square added


                if ((i*height+j)%8==0){
                    document.getElementById(`square${(i*height+j)}`).innerHTML +=`<div class="ChessSquareNumber BlackNumber">${i+1}</div>`;
                }//number added
            }
            else  { 
                document.getElementById(`row${i}`).innerHTML +=`<div class="ChessSquare Black" id="square${i*height+j}"> </div>`;
                console.log(`${(i*height+j)}`)//black square added

                if ((i*height+j)%8==0){
                    
                    document.getElementById(`square${(i*height+j)}`).innerHTML +=`<div class="ChessSquareNumber WhiteNumber">${i+1}</div>`;
                }//number added
        }
        if (i*height+j>=56){
            if ((i*height+j)%2==0)
            document.getElementById(`square${(i*height+j)}`).innerHTML +=`<div class="ChessSquareLetter WhiteNumber">${String.fromCharCode(i*height+j+41)}</div>`;
             //adding ascii value for letters in last row elemebts 
            else 
            document.getElementById(`square${(i*height+j)}`).innerHTML +=`<div class="ChessSquareLetter BlackkNumber">${String.fromCharCode(i*height+j+41)}</div>`;
            }//letter added
        }
    }
    document.getElementById("buttons").innerHTML  +=`<button id ="restartButton" onclick="restartGame()">RESTART</button><button id ="undoButton" onclick="undoMove()">UNDO</button><button id ="quitButton" onclick="quitGame()">QUIT</button>`;
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