const express = require('express');
const router = express.Router();

//lib
const Messages = require('../src/lib/Messages');

/* GET home page. */
router.get('/list', (req, res, next) => {
    Messages.list('@Room:bA5b00L6r', messages => {
        res.json(messages)
    });
});

module.exports = router;
