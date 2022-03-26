var express = require('express');
var router = express.Router();
const { store, index, show, update, destroy, actStatus } = require('./controller');
const multer = require('multer');
const os = require('os');

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

/* jurusan page. */
router.get('/', index);
router.post('/store', multer({ dest: os.tmpdir(), fileFilter: fileFilter }).single('foto'), store);
router.get('/show/:id', show);
router.patch(
	'/update/:id',
	multer({ dest: os.tmpdir(), fileFilter: fileFilter }).single('foto'),
	update
);
router.delete('/destroy/:id', destroy);
router.patch('/status/:id', actStatus);

module.exports = router;
