let instructions_btn = document.getElementById('instructions');
let return_btn = document.getElementById('instructions-cancel')

let btns = document.getElementsByClassName('btn');

const INSTRUCTIONS_TEXT = `Welcome to our small project:&nbsp;

                            <span style="letter-spacing: -8px; text-shadow: #03ffff 1px 2px,#ff00ff -1px -3px; font-family: 'Press Start'">
                                <span style="color: red;">Q</span>
                                <span style="color: orange; font-size: .75em; margin-bottom: -35px;"><sub>U</sub></span>
                                <span style="color: yellow; font-size: .75em;">I</span>
                                <span style="color: green; font-size: .75em; margin-top: -50px;"><sup>Z</sup></span>
                                <span style="color: blue; font-size: .75em; margin-bottom: -35px;"><sub>Z</sub></span>
                                <span style="color: #8c52ff;">D</span>
                            </span><br><br>

                            Given a question and 4 choices, 
                            you have to correctly answer as many questions as possible before time is up.<br><br>
                            
                            Do you have what it takes?`;
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

