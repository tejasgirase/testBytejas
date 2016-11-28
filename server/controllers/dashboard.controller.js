var express = require('express');
var router = express.Router();

// Routes
router.get('/getMessage', getMessage);

module.exports = router;

function getMessage(req, res) {
    res.send("Greetings from server..!");
}