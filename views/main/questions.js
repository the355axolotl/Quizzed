const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    const numOfQuestions = req.body["questions"];
});

function loadQuestions() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../../model/questions.json'), 'utf-8');
        return JSON.parse(data);
    } catch(error) {
        console.error('Error loading questions:', error.message);
        return [];
    }
}

function getRandomQuestions() {
    
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count)
}

function checkAnswer(questionIndex, userAnswer) {
    const question = questionsData[questionIndex];
    if (!question) return false;
    return question.answer === userAnswer;
}

function getOptionsForQuestion(question) {
    return [
        { key: 'A', value: question.A},
        { key: 'B', value: question.B},
        { key: 'C', value: question.C},
        { key: 'D', value: question.D},
        
    ];
}

const questionsData = loadQuestions();

module.exports = router;

