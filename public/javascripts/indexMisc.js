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


let INSTRUCTIONS_BTN = document.getElementById('instructions');
let RETURN_BTN = document.getElementById('instructions-cancel');

let HOME_FRAME = document.getElementById('home-frame');
let HOME_BTNS = document.getElementById('home-buttons');
let INSTRUCTION_FRAME = document.getElementById('instruction-frame-id');




// Prevent spamming when button animation on home page is underway
setTimeout(() => { 
    HOME_BTNS.classList.toggle('show'); 
    HOME_BTNS.classList.toggle('no-show');
    document.getElementById('settings').disabled = false; }, 1050);




// Home screen instructions button
INSTRUCTIONS_BTN.addEventListener('click', function(){
    if (HOME_FRAME.classList.contains('show')) {
        HOME_FRAME.classList.toggle('show');
        HOME_FRAME.classList.toggle('no-show');

        HOME_BTNS.classList.toggle('show'); 
        HOME_BTNS.classList.toggle('no-show');

        INSTRUCTION_FRAME.classList.toggle('show');
        INSTRUCTION_FRAME.classList.toggle('no-show');
    }
})

RETURN_BTN.addEventListener('click', function(){
    if (HOME_FRAME.classList.contains('no-show')) {

        INSTRUCTION_FRAME.classList.toggle('show');
        INSTRUCTION_FRAME.classList.toggle('no-show');

        HOME_FRAME.classList.toggle('show');
        HOME_FRAME.classList.toggle('no-show');

        HOME_BTNS.classList.toggle('show'); 
        HOME_BTNS.classList.toggle('no-show');
    }
})



let SETTINGS_FRAME = document.getElementById('settings-frame-id');
let SETTINGS_BTN = document.getElementById('settings');
let SETTINGS_CANCEL = document.getElementById('settings-cancel');

SETTINGS_BTN.addEventListener('click', function() {
    if (SETTINGS_FRAME.classList.contains('no-show')) {
        if (INSTRUCTION_FRAME.classList.contains('show')) {
            INSTRUCTION_FRAME.classList.toggle('show');
            INSTRUCTION_FRAME.classList.toggle('no-show');
        }

        if (HOME_FRAME.classList.contains('show')) {
            HOME_FRAME.classList.toggle('show');
            HOME_FRAME.classList.toggle('no-show');

            HOME_BTNS.classList.toggle('show'); 
            HOME_BTNS.classList.toggle('no-show');
        }

        SETTINGS_FRAME.classList.toggle('show');
        SETTINGS_FRAME.classList.toggle('no-show');
    }
})

SETTINGS_CANCEL.addEventListener('click', function() {
    if (HOME_FRAME.classList.contains('no-show')) {
        HOME_FRAME.classList.toggle('show');
        HOME_FRAME.classList.toggle('no-show');

        HOME_BTNS.classList.toggle('show'); 
        HOME_BTNS.classList.toggle('no-show');

        SETTINGS_FRAME.classList.toggle('show');
        SETTINGS_FRAME.classList.toggle('no-show');
    }
})

// For adjusting user request of #q's if beyond min/max (check index.ejs)
function imposeMinMax(num){
    if (isNaN(num.value) || num.value == "") {
        num.value = num.min;
    } else {
        if(num.value != ""){
            if(parseInt(num.value) < parseInt(num.min)){
              num.value = num.min;
            }
            if(parseInt(num.value) > parseInt(num.max)){
              num.value = num.max;
            }
        }
    }
}

// Prevent input from being entered
var SETTINGS_ELEMENTS = document.getElementsByClassName("req-setting");

for (var i = 0; i < SETTINGS_ELEMENTS.length; i++) {
    SETTINGS_ELEMENTS[i].addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    })
}