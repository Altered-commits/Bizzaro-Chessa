//----------Helper function----------
function startNewGame() {
    //New board
    setupChessBoard();
    setupDragDropEvents();
    setupChessRandomizerTimer(); //It is being cleaned in resetDomElements
}

//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to restart the game?")) {
        cleanupDragDropEvents();
        resetDomElements();
        resetPieceConfig();
        resetPieceStates();
        
        startNewGame();
    }
}

function quitGame() {
    if(confirm("Would you like to quit?"))
        window.location.href = "../Homepage/hpage.html";
}

function drawGame() {
    if(confirm("Would you like to draw the game?"))
        showStalemateScreen();
}

//----------EVENT LISTENER FOR WINDOW----------
window.addEventListener('DOMContentLoaded', () => {
    startNewGame();
});