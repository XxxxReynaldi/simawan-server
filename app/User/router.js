var express = require('express');
var router = express.Router();
const { index, actionSignin, actionLogout } = require('./controller');

router.get('/', index);
router.post('/', actionSignin);
router.get('/logout', actionLogout);
module.exports = router;
