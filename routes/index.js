const express = require('express');
var router = express.Router();
const questionModel = require('../model/questions');
var axios = require("axios");

//This is specifically for session tokens
const baseURL = "https://opentdb.com/api_token.php";

router.get('/', async function(req, res, next) {
    if (req.cookies.newSession == "false") {
        res.cookie("newSession", "false");
    } else {
        res.cookie("newSession", "true");
        //Session Tokens, Asks the api for a session token
        const response = await axios.get(
            baseURL,
            {
                params: {
                    command: "request"
                }
            }
        );
        console.log(response.data);
        console.log(response.data.token)
        res.cookie("session", response.data.token);
    }
    res.render('./home/index', { title : 'Quizzd'});
});

router.get('/results', (req, res) => {
    res.render('./main/results', {
        score: req.session.score,
        totalQuestions: req.session.totalQuestions
    });
});

router.get('/replay', (req,res) => {
    res.cookie("newSession", "false");
    req.session.score = 0;
    res.redirect('/');
});

module.exports = router;
