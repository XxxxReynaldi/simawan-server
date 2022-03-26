var express = require('express');
var router = express.Router();
const { store, index, show, update, destroy, actStatus, checkKode } = require('./controller');

/* kelas page. */
router.get('/', index);
router.post('/store', store);
router.get('/show/:id', show);
router.patch('/update/:id', update);
router.delete('/destroy/:id', destroy);
router.patch('/status/:id', actStatus);
router.get('/check/:id', checkKode);

module.exports = router;
