const express = require('express');
const router = express.Router();

//lib
const Rooms = require('../src/lib/Rooms');

/* GET rooms page. */
router.get('/list', (req, res, next) => {
    Rooms.list(req.user._id, rooms => {
        res.json(rooms)
    });
});

module.exports = router;
