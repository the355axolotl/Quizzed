let instructions_btn = document.getElementById('instructions');
let return_btn = document.getElementById('instructions-cancel')

let btns = document.getElementsByClassName('btn');

const INSTRUCTIONS_TEXT = "Welcome to our small project Quizzd! We hope you enjoy this demo.";
document.getElementById('instructions-text').innerHTML = INSTRUCTIONS_TEXT;

// Prevent spamming when button animation is underway
setTimeout(() => {
    for (let btn of btns) {
        btn.style.visibility = 'visible';
    }
}, 1250);

var clicked = false;
instructions_btn.addEventListener('click', function(){
    var home_frame = document.getElementById('home-frame');

    if (!clicked) {
        document.getElementById('home-frame').style.visibility = 'hidden';
        document.getElementById('play-start').style.visibility = 'hidden';
        document.getElementById('instructions').style.visibility = 'hidden';

        document.getElementById('instruction-frame-id').style.visibility = 'visible';
        clicked = true;
    }
})

return_btn.addEventListener('click', function(){
    if (clicked) {
        clicked = false;

        document.getElementById('instruction-frame-id').style.visibility = 'hidden';
        document.getElementById('home-frame').style.visibility = 'visible';
        document.getElementById('play-start').style.visibility = 'visible';
        document.getElementById('instructions').style.visibility = 'visible';
    }
})

