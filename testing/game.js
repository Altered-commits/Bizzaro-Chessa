let chessPieces;
let chessSquares;
let pieces = []; // Make sure pieces is declared globally

function pieceCaptureOrMove(square, piece) {
    const existingPiece = square.querySelector(".ChessPiece");

    console.log(piece);
    if (locationCheck(piece.id,square)) { // add location check here
        if (existingPiece) {
            if (existingPiece.id[0] !== piece.id[0]) {
                square.replaceChild(piece, existingPiece);
            }
        } else {
            square.appendChild(piece);
        }
    }
}
function getPieceById(pieceId) {
    const piece = pieces.find(p => `${p.color}${p.type.charAt(0).toUpperCase() + p.type.slice(1)}${p.pieceId}` === pieceId);
    console.log(`Found piece:`, piece);
    return piece;
}

function startGame() {
    const height = 8;
    const width = 8;
    document.getElementById("border").innerHTML += `<div class="ChessBoard" id="board"> </div>`; // adding board so it looks clean when start is not pressed

    for (let i = 0; i < height; i++) {
        document.getElementById("board").innerHTML += `<div class="ChessRow" id="row${i}"></div>`; // adding chessrow one by one
        for (let j = 0; j < width; j++) {

            if ((i + j) % 2 == 0) {
                document.getElementById(`row${i}`).innerHTML += `<div class="ChessSquare White" id="square${i * height + j}"> </div>`;
                console.log(`${(i * height + j)}`) // white square added

                if ((i * height + j) % 8 == 0) {
                    document.getElementById(`square${(i * height + j)}`).innerHTML += `<div class="ChessSquareNumber BlackNumber">${i + 1}</div>`;
                } // number added
            } else {
                document.getElementById(`row${i}`).innerHTML += `<div class="ChessSquare Black" id="square${i * height + j}"> </div>`;
                console.log(`${(i * height + j)}`) // black square added

                if ((i * height + j) % 8 == 0) {
                    document.getElementById(`square${(i * height + j)}`).innerHTML += `<div class="ChessSquareNumber WhiteNumber">${i + 1}</div>`;
                } // number added
            }

            if (i * height + j >= 56) {
                if ((i * height + j) % 2 == 0)
                    document.getElementById(`square${(i * height + j)}`).innerHTML += `<div class="ChessSquareLetter WhiteNumber">${String.fromCharCode(i * height + j + 41)}</div>`;
                // adding ascii value for letters in last row elements 
                else
                    document.getElementById(`square${(i * height + j)}`).innerHTML += `<div class="ChessSquareLetter BlackNumber">${String.fromCharCode(i * height + j + 41)}</div>`;
                // letter added
            }
        }
    }
    setPieces();
    document.getElementById("startButton").outerHTML = '';
    document.getElementById("buttons").innerHTML += `<button id ="restartButton" onclick="restartGame()">RESTART</button><button id ="undoButton" onclick="undoMove()">UNDO</button><button id ="quitButton" onclick="quitGame()">QUIT</button>`;
}

function setPieces() {
    const whiteRook1 = new rook('White');
    const whiteKnight1 = new knight('White');
    const whiteBishop1 = new bishop('White');
    const whiteKing = new king('White');
    const whiteQueen = new queen('White');
    const whiteBishop2 = new bishop('White');
    const whiteKnight2 = new knight('White');
    const whiteRook2 = new rook('White');
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
    console.log(whitePawn1.location);

    const blackRook1 = new rook('Black');
    const blackKnight1 = new knight('Black');
    const blackBishop1 = new bishop('Black');
    const blackKing = new king('Black');
    const blackQueen = new queen('Black');
    const blackBishop2 = new bishop('Black');
    const blackKnight2 = new knight('Black');
    const blackRook2 = new rook('Black');
    const blackPawn1 = new pawn('Black');
    const blackPawn2 = new pawn('Black');
    const blackPawn3 = new pawn('Black');
    const blackPawn4 = new pawn('Black');
    const blackPawn5 = new pawn('Black');
    const blackPawn6 = new pawn('Black');
    const blackPawn7 = new pawn('Black');
    const blackPawn8 = new pawn('Black');

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

    pieces = [
        whiteRook1, whiteKnight1, whiteBishop1, whiteKing, whiteQueen,
        whiteBishop2, whiteKnight2, whiteRook2, whitePawn1, whitePawn2,
        whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8,
        blackRook1, blackKnight1, blackBishop1, blackKing, blackQueen,
        blackBishop2, blackKnight2, blackRook2, blackPawn1, blackPawn2,
        blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8
    ];

    updateBoardElements();
    setup();
}

function updateBoardElements() {
    chessPieces = document.querySelectorAll('.ChessPiece');
    chessSquares = document.querySelectorAll('.ChessSquare');
}

// Add event listeners for drag-and-drop
function setup() {
    updateBoardElements();
    chessPieces.forEach((piece) => {
        piece.setAttribute('draggable', true);

        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', piece.id); // Store the piece ID
        });
    });

    chessSquares.forEach((square) => {
        square.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        square.addEventListener('drop', (e) => {
            e.preventDefault();
            // Get the piece ID from the data transfer
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

function restartGame() {
    location.reload();
}

function quitGame() {
    if (confirm("Do you want to quit?")) {
        window.close();
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault(); // Optional: prevent the default action if needed
        location.reload(); // Reload the page
    }
});

class piece {
    constructor(color, type) {
        this.color = color;
        this.type = type;
        this.location = -1;

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
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}${this.type.charAt(0).toUpperCase() + this.type.slice(1)}${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}${this.type.charAt(0).toUpperCase() + this.type.slice(1)}.png" alt="${this.color}${this.type}"></div>`;
        
        console.log(`"${this.color}${this.type.charAt(0).toUpperCase() + this.type.slice(1)}${this.pieceId}"`);
        this.location = location;
        const wasMoved=false;
        }
    updateFEN() {}
}


class king extends piece {
    static kingCounter = 0;
    constructor(color) {
        super(color, 'king');
        this.pieceId = ++king.kingCounter;
    }
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}King${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}King.png" alt="Bking"></div>`;
        console.log(` "${this.color}King${this.pieceId}"`);
        this.location = location;
    }
    updateFEN() {}
}

class queen extends piece {
    static queenCounter = 0;
    constructor(color) {
        super(color, 'queen');
        this.pieceId = ++queen.queenCounter;
    }
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}Queen${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}Queen.png" alt="Bqueen"></div>`;
        console.log(` "${this.color}Queen${this.pieceId}"`);
        this.location = location;
    }
    updateFEN() {}
}

class bishop extends piece {
    static bishopCounter = 0;
    constructor(color) {
        super(color, 'bishop');
        this.pieceId = ++bishop.bishopCounter;
    }
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}Bishop${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}Bishop.png" alt="BBishop"></div>`;
        console.log(` "${this.color}Bishop${this.pieceId}"`);
        this.location = location;
    }

    updateFEN() {}
}

class rook extends piece {
    static rookCounter = 0;
    constructor(color) {
        super(color, 'rook');
        this.pieceId = ++rook.rookCounter;
    }
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}Rook${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}Rook.png" alt="Brook"></div>`;
        console.log(` "${this.color}Rook${this.pieceId}"`);
        this.location = location;
    }
    updateFEN() {}
}

class knight extends piece {
    static knightCounter = 0;
    constructor(color) {
        super(color, 'knight');
        this.pieceId = ++knight.knightCounter;
    }
    place(location) {
        document.getElementById(`square${location}`).innerHTML = `<div class="ChessPiece" id="${this.color}Knight${this.pieceId}">
            <img src="ChessPiecesPng/${this.color}Knight.png" alt="Bknight"></div>`;
        console.log(` "${this.color}Knight${this.pieceId}"`);
        this.location = location;
    }
    updateFEN() {}
}

function locationCheck(pieceId,targetblock) {
    const piece = getPieceById(pieceId);
    if (piece instanceof bishop) {
        return true;
    }
    if (piece instanceof knight) {
        return true;
    }
    if (piece instanceof rook) {
        return true;
    }
    if (piece instanceof queen) {
        return true;
    }
    if (piece instanceof king) {
        return true;
    }
    if (piece instanceof pawn) {
        const targetLocation = parseInt(targetblock.id.slice(6));
        const pieceloc = parseInt(piece.location);
        console.log(pieceloc)
        console.log(targetLocation)

        if (piece.color === 'White') {
            // White pawn valid moves: 8 or 16 blocks forward
            if (!piece.wasMoved){
                
                if (targetLocation == pieceloc + 8 || targetLocation == pieceloc + 16)
                    { 
                        piece.wasMoved=true;
                        piece.location=targetLocation;
                        return true;
                    };
            }//moves 8 blocks forward
            else{
                if (targetLocation == pieceloc + 8)
                    {
                        piece.location=targetLocation;
                        return true;
                    };
            }
            
            
        } else if (piece.color === 'Black') {
            if (!piece.wasMoved){
                
                if (targetLocation == pieceloc - 8 || targetLocation == pieceloc - 16)
                    {   piece.wasMoved=true;
                        console.log("he");
                        piece.location=targetLocation;
                        return true;
                    };
            }//moves 8 blocks forward
            else{
                console.log("be")
                if (targetLocation == pieceloc -8)
                    {
                        piece.location=targetLocation;
                        return true;
                    };
            }
        }
    }
    else {
        console.log("bye.");
    }
}
