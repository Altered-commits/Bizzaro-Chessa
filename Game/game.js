//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to restart the game?")) {
        cleanupDragDropEvents();
        resetDomElements();
        resetPieceConfig();
        resetPieceStates();
        
        //New board
        setupChessBoard();
        setupDragDropEvents();
        setupChessRandomizerTimer(); //It is being cleaned in resetDomElements
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
    setupChessRandomizerTimer();
});