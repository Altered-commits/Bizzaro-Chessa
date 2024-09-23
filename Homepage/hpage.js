const homeScreen     = document.querySelector('.HomeScreen');
const aboutUsScreen  = document.querySelector('.AboutUsScreen');
const settingsScreen = document.querySelector('.SettingsScreen');

//Settings options
const randomizerDurationInput = document.querySelector('.RandomizerDuration input');
const flipBoardInput          = document.querySelector('.FlipBoard input');
const movementSoundInput      = document.querySelector('.MovementSound input');

//----------String constants defining transitions----------
const enteringTransition = "transform 0.8s cubic-bezier(0.5, 0, 0.75, 1), opacity 1.2s ease-out 0.8s";
const exitingTransition  = "transform 0.8s cubic-bezier(0.5, 0, 0.75, 1) 0.5s, opacity 0.5s ease-out";

//----------Functions----------
function startGame() {
    //Just so user doesn't directly go to game, instead the user has to use homepage to go to game
    sessionStorage.setItem("canPlayGame", "1");
    window.location.href = "../Game/game.html";
}

//Settings, About us
function aboutUs() {
    homeScreen.classList.add("inactive");
    aboutUsScreen.classList.add("active");

    aboutUsScreen.style.transition = enteringTransition;
}

function settings() {
    homeScreen.classList.add("inactive");
    settingsScreen.classList.add("active");

    settingsScreen.style.transition = enteringTransition;
}

//Back button
function back() {
    //Bring back home screen back to where it belongs
    homeScreen.classList.remove("inactive");

    //Push back the rest of the screens
    if(aboutUsScreen.classList.contains("active")) {
        aboutUsScreen.style.transition = exitingTransition;
        aboutUsScreen.classList.remove("active");
    }

    if(settingsScreen.classList.contains("active")) {
        settingsScreen.style.transition = exitingTransition;
        settingsScreen.classList.remove("active");
    }
}

//Save button
function saveSettings() {
    //Save settings to session storage
    sessionStorage.setItem("randomizerDuration", randomizerDurationInput.value);
    sessionStorage.setItem("flipBoard", flipBoardInput.checked);
    sessionStorage.setItem("movementSound", movementSoundInput.checked);

    alert("Settings saved successfuly");
}

function quitGame() {
    if(confirm("Are you sure you want to quit?"))
        window.close();
}

//Load settings from session storage
//Using windows event listener
window.addEventListener("DOMContentLoaded", () => {
    //First time playing, no settings have been saved, save default settings
    if(sessionStorage.length === 0) {
        sessionStorage.setItem("randomizerDuration", "60");
        sessionStorage.setItem("flipBoard", "false");
        sessionStorage.setItem("movementSound", "true");
    }

    const savedRandomizerDuration = sessionStorage.getItem("randomizerDuration");
    const savedFlipBoard          = sessionStorage.getItem("flipBoard") === "true";
    const savedMovementSound      = sessionStorage.getItem("movementSound") === "true";

    //Give default value if they don't exist
    randomizerDurationInput.value = savedRandomizerDuration;
    flipBoardInput.checked        = savedFlipBoard;
    movementSoundInput.checked    = savedMovementSound;
});