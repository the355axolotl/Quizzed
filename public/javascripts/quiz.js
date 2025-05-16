// Change settings button to End Round
document.getElementById('settings').id = 'end-round';
var endRound = document.getElementById('end-round');
var quizForm = document.getElementById('answer-form');
var currentQuestions = document.getElementById("current-qs");
var totalQuestions = document.getElementById("total-qs");

endRound.disabled = false;
endRound.innerHTML = 'End Round';

endRound.addEventListener('click', function() {
    currentQuestions.value = totalQuestions.value;
    quizForm.submit();
})


// Delay answers to access DOM elements successfully
setTimeout(() => {
    const options = document.getElementsByClassName('option');
    const submitButton = document.getElementById('submit-answer');

    for (const choice of options) {
        choice.classList.toggle('no-show');
        choice.classList.toggle('show');
    }

    submitButton.classList.toggle('no-show');
    submitButton.classList.toggle('show');

    function answerFeedback(event) {
        const formData = new FormData(quizForm);
    
        event.preventDefault();
    
        var correctAnswer = document.getElementById('ansk');
        var userAnswer = formData.get('answer');

        submitButton.classList.toggle('show');
        submitButton.classList.toggle('no-show');
    
        for (const choice of options) {
            console.log(choice);
            
            if (choice.id != correctAnswer.value && choice.id != userAnswer) {
                choice.classList.toggle('show');
                choice.classList.toggle('no-show');
            }

            if (choice.id == correctAnswer.value) {
                choice.style.color = 'green';
            } else {
                choice.style.color = 'red';
            }
        }
        
        setTimeout(() => {  quizForm.submit()}, 1250);
    }
    
    quizForm.addEventListener('submit', answerFeedback);
}, 1500);