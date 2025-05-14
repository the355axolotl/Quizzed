document.getElementById('settings').id = 'end-round';

var endRound = document.getElementById('end-round')

endRound.disabled = false;
endRound.innerHTML = 'End Round';

endRound.addEventListener('click', function() {
    document.getElementById("current-qs").value = document.getElementById("total-qs").value;
    document.getElementById("answer-form").submit();
})