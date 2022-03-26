var express = require('express');
var router = express.Router();
const { store, index, show, update, destroy } = require('./controller');

/* meninggalkan sekolah page. */
router.get('/', index);
router.post('/store', store);
router.get('/show/:id', show);
router.patch('/update/:id', update);
router.delete('/destroy/:id', destroy);

module.exports = router;
