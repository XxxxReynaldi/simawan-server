var express = require('express');
var router = express.Router();
const { store, index, show, update, destroy, actStatus, isKode, find } = require('./controller');

/* kelas page. */
router.get('/', index);
router.get('/find/:tahunAjaran/:tingkatan?', find);
router.post('/store', store);
router.get('/show/:id', show);
router.patch('/update/:id', update);
router.delete('/destroy/:id', destroy);
router.patch('/status/:id', actStatus);
router.get('/check/:id', isKode);

module.exports = router;
