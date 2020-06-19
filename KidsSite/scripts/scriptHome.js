"use strict";
let allMainElements = document.getElementsByClassName("elementOfMain");//getting all elements that will be manipulated using the class name

//adding events to the elements on the DOM
for (let i = 0; i < allMainElements.length; i++) {
    allMainElements[i].addEventListener("click", enterAnimation);
    allMainElements[i].children[0].addEventListener("animationend", enterVideo);
    allMainElements[i].getElementsByTagName("video")[0].addEventListener("ended", exitAnimation);
}
//After the fade animation ends it keeps the screen black and go to the home page
function enterAnimation(event) {
    let audioElement = event.target.nextElementSibling.children[2];
    event.target.className = "enterAnimation"; //changing the classname of the img element to trigger the rotation animaton
    audioElement.play();
}
//This is how the video is played after the animal image is clicked
function enterVideo(event) {
    let overlayWrapper = event.target.nextElementSibling;
    let imageElement = event.target;
    let videoElement = event.target.nextElementSibling.children[0];
    let audioElement = event.target.nextElementSibling.children[1];
    //event is img element here
    if (event.target.className != "exitAnimation") {
        imageElement.style.display = "none";
        overlayWrapper.style.display = "block";
        videoElement.play();
        audioElement.play();
    }
}

//Once the video ends this function id called so the animal spins again and appears on the page
function exitAnimation(event) {
    let overlayWrapper = event.target.parentNode;
    let imageElement = event.target.parentNode.previousElementSibling;
    overlayWrapper.style.display = "none";//hidding video through the overlay
    imageElement.className = "exitAnimation";
    imageElement.style.display = "block";//showing img again

}