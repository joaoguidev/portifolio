//--------------------------------------Landing Page-------------------------------------------
var landingPage = document.getElementById("langingPageFade");
landingPage.addEventListener("animationend", goToHomePage);

//After the fade animation ends it keeps the screen black and go to the home page
function goToHomePage(event) {
    landingPage.style.backgroundColor = "black";//keep screen black after the fade
    window.location.href = "home.html";// go to the other page
}

