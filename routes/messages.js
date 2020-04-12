const express = require('express');
const router = express.Router();

//lib
const Messages = require('../src/lib/Messages');

/* GET home page. */
router.get('/list', (req, res, next) => {
    Messages.list(req.query.roomId, messages => {
        res.json(messages)
    });
});

module.exports = router;
