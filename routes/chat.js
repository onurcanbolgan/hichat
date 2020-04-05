let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('chat', {user: req.user});
});

module.exports = router;
