let express = require('express'),
    router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource')
});

router.get('/profile', function(req, res, next) {
    res.render('index', { title: 'Profile'})
})

module.exports = router;
