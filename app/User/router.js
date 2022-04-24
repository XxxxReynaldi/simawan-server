var express = require('express');
var router = express.Router();
const {
	index,
	actionSignin,
	actionLogout,
	showProfile,
	validation,
	getValidation,
	updateProfile,
	updatePassword,
	updatePhoto,
} = require('./controller');
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

router.get('/', index); //tidak dipakai
router.post('/', actionSignin); //tidak dipakai
router.get('/show-profile/:id', showProfile);
router.get('/logout', actionLogout);
router.post('/validation', getValidation);
router.patch('/validation/:id', validation);
router.patch('/update-profile/:id', updateProfile);
router.patch('/update-password/:id', updatePassword);
router.patch(
	'/update-photo/:id',
	multer({ dest: os.tmpdir(), fileFilter: fileFilter }).single('foto'),
	updatePhoto
);
module.exports = router;
