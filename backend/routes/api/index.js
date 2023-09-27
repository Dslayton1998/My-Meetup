const router = require('express').Router();

//* Test route
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });
  
module.exports = router;