var express = require('express');
var router = express.Router();
const { index, actionSignin, actionLogout, validation, getValidation } = require('./controller');

router.get('/', index);
router.post('/', actionSignin);
router.get('/logout', actionLogout);
router.post('/validation', getValidation);
router.patch('/validation/:id', validation);
module.exports = router;
