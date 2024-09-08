//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to restart the game?")) {
        cleanupDragDropEvents();
        resetDomElements();
        resetPieceStates();
        
        //New board
        setupChessBoard();
        setupDragDropEvents();
    }
}

function quitGame() {
    if(confirm("Would you like to quit?"))
        window.close();
}

function drawGame() {
    if(confirm("Would you like to draw the game?"))
        showStalemateScreen();
}

//----------EVENT LISTENER FOR WINDOW----------
window.addEventListener('DOMContentLoaded', () => {
    setupChessBoard();
    setupDragDropEvents();
});