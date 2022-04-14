const User = require('./model');
const Siswa = require('../Siswa/model');
const bcrypt = require('bcryptjs');

module.exports = {
	index: async (req, res) => {
		try {
			if (req.session.user === null || req.session.user === undefined) {
				res.render('admin/users/view_signin', {
					alert,
					title: 'Halaman signin',
				});
			} else {
				res.redirect('/dashboard');
			}
		} catch (err) {
			req.flash('alertMessage', `${err.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/');
		}
	},

	actionSignin: async (req, res) => {
		try {
			const { email, password } = req.body;
			const check = await User.findOne({ email: email });

			if (check) {
				if (check.status === 'Y') {
					const checkPassword = await bcrypt.compare(password, check.password);
					if (checkPassword) {
						req.session.user = {
							id: check._id,
							email: check.email,
							status: check.status,
							name: check.name,
						};
						// res.redirect('/dashboard');
						next();
					} else {
						res.status(400).json({
							message: 'Kata sandi yang anda inputkan salah',
						});
					}
				} else {
					res.status(400).json({
						message: 'Mohon maaf status anda belum aktif',
					});
				}
			} else {
				res.status(400).json({
					message: 'Email yang anda inputkan salah',
				});
			}
		} catch (err) {
			next(err);
		}
	},
	actionLogout: (req, res) => {
		req.session.destroy();
		res.status(200).json({
			message: 'Berhasil Logout',
		});
	},

	validation: async (req, res, next) => {
		try {
			const { id } = req.params;
			const checkUser = await User.findOne({ _id: id });

			if (checkUser) {
				let validasi = checkUser.validasi === 'pending' ? 'valid' : 'pending';
				await User.findOneAndUpdate({ _id: id }, { validasi });

				let xUser = await User.findOne({ _id: id });
				const { namaLengkap, NISN, tempatLahir, tanggalLahir, noHp } = xUser;
				let siswa = await Siswa({ namaLengkap, NISN, tempatLahir, tanggalLahir, noHp });
				await siswa.save();

				res.status(200).json({
					message: 'Data berhasil diubah',
					data: xUser,
				});
			}
		} catch (err) {
			next(err);
		}
	},

	getValidation: async (req, res, next) => {
		try {
			const { validasi } = req.body;
			const userValidasi = await User.find({ validasi, role: 'siswa' });
			const jumlah = await User.countDocuments({ validasi, role: 'siswa' });

			res.status(200).json({
				message: `${jumlah} Data berhasil ditampilkan`,
				count: jumlah,
				data: userValidasi,
			});
		} catch (err) {
			next(err);
		}
	},
};
