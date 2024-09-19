const homeScreen     = document.querySelector('.HomeScreen');
const aboutUsScreen  = document.querySelector('.AboutUsScreen');
const settingsScreen = document.querySelector('.SettingsScreen');

//----------String constants defining transitions----------
const enteringTransition = "transform 0.8s cubic-bezier(0.5, 0, 0.75, 1), opacity 1.2s ease-out 0.8s";
const exitingTransition  = "transform 0.8s cubic-bezier(0.5, 0, 0.75, 1) 0.5s, opacity 0.5s ease-out";

//----------Functions----------
function startGame() {
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

function quitGame() {
    if(confirm("Are you sure you want to quit?"))
        window.close();
}