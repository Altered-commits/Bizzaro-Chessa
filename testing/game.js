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
    setPieces();
    document.getElementById("startButton").outerHTML='';
    document.getElementById("buttons").innerHTML  +=`<button id ="restartButton" onclick="restartGame()">RESTART</button><button id ="undoButton" onclick="undoMove()">UNDO</button><button id ="quitButton" onclick="quitGame()">QUIT</button>`;
}
function setPieces(){
    const whiteRook1 = new rook ('White');
    const whiteKnight1 =  new knight('White');
    const whiteBishop1 = new bishop('White');
    const whiteKing = new king('White');
    const whiteQueen = new queen ('White')
    const whiteBishop2 = new bishop('White');
    const whiteKnight2 =  new knight('White');
    const whiteRook2 = new rook ('White');
    const whitePawn1 = new pawn('White');
    const whitePawn2 = new pawn('White');
    const whitePawn3 = new pawn('White');
    const whitePawn4 = new pawn('White');
    const whitePawn5 = new pawn('White');
    const whitePawn6 = new pawn('White');
    const whitePawn7 = new pawn('White');
    const whitePawn8 = new pawn('White');

    whiteRook1.place('0');
    whiteKnight1.place('1');
    whiteBishop1.place('2');
    whiteKing.place('3');
    whiteQueen.place('4');
    whiteBishop2.place('5');
    whiteKnight2.place('6');
    whiteRook2.place('7');
    whitePawn1.place('8');
    whitePawn2.place('9');
    whitePawn3.place('10');
    whitePawn4.place('11');
    whitePawn5.place('12');
    whitePawn6.place('13');
    whitePawn7.place('14');
    whitePawn8.place('15');
    
    const blackRook1 = new rook('Black');
    const blackKnight1 = new knight('Black');
    const blackBishop1 = new bishop('Black');
    const blackKing = new king('Black');
    const blackQueen = new queen('Black');
    const blackBishop2 = new bishop('Black');
    const blackKnight2 = new knight('Black');   
    const blackRook2 = new rook('Black');
    const blackPawn1 = new  pawn('Black');
    const blackPawn2 = new  pawn('Black');
    const blackPawn3 = new  pawn('Black');
    const blackPawn4 = new  pawn('Black');
    const blackPawn5 = new  pawn('Black');
    const blackPawn6 = new  pawn('Black');
    const blackPawn7 = new  pawn('Black');
    const blackPawn8 = new  pawn('Black');

    blackPawn1.place('48');
    blackPawn2.place('49');
    blackPawn3.place('50');
    blackPawn4.place('51');
    blackPawn5.place('52');
    blackPawn6.place('53');
    blackPawn7.place('54');
    blackPawn8.place('55');
    blackRook1.place('56');
    blackKnight1.place('57');
    blackBishop1.place('58');
    blackKing.place('59');
    blackQueen.place('60');
    blackBishop2.place('61');
    blackKnight2.place('62');
    blackRook2.place('63');


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
class piece{
    constructor(color, type) {
        this.color = color;
        this.type = type;
    }

    place(location) {
        // To be overridden by subclasses
    }
}
class pawn extends piece {
    static pawnCounter = 0;
    constructor(color) {
        super(color, 'pawn');
        this.pieceId = ++pawn.pawnCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}Pawn${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}Pawn.png" alt="BPawn"></div>`;
        console.log(` "${this.color}Pawn${this.pieceId}"`);
    }
    updateFEN(){}
}
class king extends piece{    
    static kingCounter = 0;
    constructor(color) {
        super(color, 'king');
        this.pieceId = ++king.kingCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}King${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}King.png" alt="Bking"></div>`;
        console.log(` "${this.color}King${this.pieceId}"`);
    }
    updateFEN(){}
}

class queen extends piece{
    static queenCounter = 0;
    constructor(color) {
        super(color, 'queen');
        this.pieceId = ++queen.queenCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}queen${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}Queen.png" alt="Bqueen"></div>`;
        console.log(` "${this.color}queen${this.pieceId}"`);
    }
    updateFEN(){}
}
class bishop extends piece{
    static bishopCounter = 0;
    constructor(color) {
        super(color, 'bishop');
        this.pieceId = ++bishop.bishopCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}bishop${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}Bishop.png" alt="BBishop"></div>`;
        console.log(` "${this.color}bishop${this.piecenId}"`);
    }
    updateFEN(){}
}
class rook extends piece{
    static rookCounter = 0;
    constructor(color) {
        super(color, 'rook');
        this.pieceId = ++rook.rookCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}rook${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}Rook.png" alt="Brook"></div>`;//yohohohohoho
        console.log(` "${this.color}rook${this.piecenId}"`);
    }
    updateFEN(){}
}
class knight extends piece{
    static knightCounter = 0;
    constructor(color) {
        super(color, 'Knight');
        this.pieceId = ++knight.knightCounter;
    }
    place (location){
        document.getElementById(`square${location}`).innerHTML=`<div class="ChessPiece" id="${this.color}Knight${this.pieceId}">
                        <img src="ChessPiecesPng/${this.color}Knight.png" alt="Bknight"></div>`;
        console.log(` "${this.color}Knight${this.piecenId}"`);
    }
    updateFEN(){}
}
