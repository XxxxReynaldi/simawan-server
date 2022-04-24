const User = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

const Siswa = require('../Siswa/model');
const bcrypt = require('bcryptjs');
const HASH_ROUND = 10;

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

	showProfile: async (req, res, next) => {
		try {
			const { id } = req.params;
			const isUser = await User.findOne({ _id: id });

			if (!isUser) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			delete isUser._doc.password;

			res.status(200).json({
				message: 'Data berhasil ditampilkan',
				data: isUser,
			});
		} catch (err) {
			next(err);
		}
	},

	updatePhoto: async (req, res, next) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ _id: id });
			if (!user) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/user/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						let currentImage = `${config.rootPath}/public/images/user/${user.foto}`;
						if (user.foto !== 'default.jpg') {
							if (fs.existsSync(currentImage)) {
								fs.unlinkSync(currentImage);
							}
						}

						await User.findOneAndUpdate({ _id: id }, { foto: filename });

						let xUser = await User.findOne({ _id: id });

						res.status(200).json({
							message: 'Data berhasil diperbarui',
							data: xUser,
						});
					} catch (err) {
						next(err);
					}
				});
			}
		} catch (err) {
			next(err);
		}
	},

	updateProfile: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { namaLengkap, email } = req.body;

			const isUser = await User.findOne({ _id: id });
			if (!isUser) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			const isEmail = await User.findOne({ _id: id, email });
			if (!isEmail) {
				const hasUser = await User.findOne({ email });
				if (hasUser) {
					const error = {
						status: 404,
						data: hasUser,
						errors: { email: { kind: 'duplicate', message: 'Data sudah ada' } },
					};
					throw error;
				}
				await User.findOneAndUpdate({ _id: id }, { namaLengkap, email });
				let updatedUser = await User.findOne({ _id: id });
				res.status(200).json({
					message: 'Data berhasil diperbarui',
					data: updatedUser,
				});
			}
			if (isEmail.email === email) {
				await User.findOneAndUpdate({ _id: id }, { namaLengkap });
				let updatedUser = await User.findOne({ _id: id });
				res.status(200).json({
					message: 'Data berhasil diperbarui',
					data: updatedUser,
				});
			}
		} catch (err) {
			next(err);
		}
	},

	updatePassword: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { oldPassword, newPassword, confirmPass } = req.body;
			const user = await User.findOne({ _id: id });
			if (!user) {
				res.status(404).json({
					message: 'Data tidak ditemukan !',
				});
			}
			const checkPassword = bcrypt.compareSync(oldPassword, user.password);
			if (!checkPassword) {
				res.status(403).json({
					message: 'password yang anda masukan salah.',
					fields: { oldPassword: { message: 'password yang anda masukan salah.' } },
				});
			}

			if (newPassword !== confirmPass) {
				res.status(403).json({
					message: 'password yang anda masukan tidak sama.',
					fields: { confirmPass: { message: 'password yang anda masukan tidak sama.' } },
				});
			}

			const password = bcrypt.hashSync(newPassword, HASH_ROUND);
			await User.findOneAndUpdate({ _id: id }, { password });

			let updatedUser = await User.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diperbarui',
				data: updatedUser,
			});
		} catch (err) {
			next(err);
		}
	},

	validation: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { kelas } = req.body;

			const isUser = await User.findOne({ _id: id });

			if (isUser) {
				let validasi = isUser.validasi === 'pending' ? 'valid' : 'pending';
				await User.findOneAndUpdate({ _id: id }, { validasi });

				let xUser = await User.findOne({ _id: id });
				const { namaLengkap, NISN, tempatLahir, tanggalLahir, noHp } = xUser;
				let siswa = await Siswa({ namaLengkap, NISN, tempatLahir, tanggalLahir, noHp, kelas });
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
