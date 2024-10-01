//----------Helper function----------
//ChatGPT copied
function isTouchDevice() {
    return (
        'ontouchstart' in window || // Checks for touch event support in most browsers
        navigator.maxTouchPoints > 0 || // Modern touch-enabled devices
        window.matchMedia("(pointer: coarse)").matches // Detects coarse input, typical of touchscreens
    );
}

function startNewGame() {
    //New board
    setupChessBoard();
    
    if(isTouchDevice())
        setupTouchEvents();

    setupDragDropEvents();
    setupChessRandomizerTimer(); //It is being cleaned in resetDomElements
}

//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to restart the game?")) {
        if(isTouchDevice())
            cleanupTouchEvents();

        cleanupDragDropEvents();
        resetDomElements();
        resetPieceConfig();
        resetPieceStates();
        
        startNewGame();
    }
}

function quitGame() {
    if(confirm("Would you like to quit?"))
        window.location.href = "/";
}

function drawGame() {
    if(confirm("Would you like to draw the game?"))
        showStalemateScreen();
}

//----------EVENT LISTENER FOR WINDOW----------
window.addEventListener('DOMContentLoaded', () => {
    startNewGame();
});