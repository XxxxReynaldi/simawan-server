var express = require('express');
var router = express.Router();
const { store, index, show, update, destroy } = require('./controller');
const multer = require('multer');
const os = require('os');

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'application/pdf' ||
		file.mimetype === 'application/msword'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

/* akademik siswa page. */
router.get('/', index);
router.post(
	'/store',
	multer({ dest: os.tmpdir(), fileFilter: fileFilter }).single('fileIjazah'),
	store
);
router.get('/show/:id', show);
router.patch(
	'/update/:id',
	multer({ dest: os.tmpdir(), fileFilter: fileFilter }).single('fileIjazah'),
	update
);
router.delete('/destroy/:id', destroy);

module.exports = router;
