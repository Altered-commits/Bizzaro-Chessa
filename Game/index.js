//----------Buttons----------
function restartGame() {
    if(confirm("Would you really like to reload?")) {
        cleanupDragDropEvents();
        cleanupDomElements();
        
        location.reload();
    }
}

function quitGame() {
    if(confirm("Would you really like to quit?"))
        window.close();
}

//----------EVENT LISTENERS FOR DOCUMENTS AND WINDOWS----------
window.addEventListener('DOMContentLoaded', (e) => {
    setupChessBoard();
    setupDragDropEvents();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        location.reload();
    }
});