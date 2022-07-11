const User = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

const Kelas = require('../Kelas/model');
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
				message: 'Data profile user berhasil ditampilkan',
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

	removePhoto: async (req, res, next) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ _id: id });
			if (!user) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			let currentImage = `${config.rootPath}/public/images/user/${user.foto}`;
			if (user.foto !== 'default.jpg') {
				if (fs.existsSync(currentImage)) {
					fs.unlinkSync(currentImage);
				}
			}

			await User.findOneAndUpdate({ _id: id }, { foto: 'default.jpg' });

			let xUser = await User.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diperbarui',
				data: xUser,
			});
		} catch (err) {
			next(err);
		}
	},

	updateProfile: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { namaLengkap, email } = req.body;

			if (!namaLengkap) {
				const error = {
					status: 403,
					errors: { namaLengkap: { kind: 'entry is empty', message: 'Data wajib diisi' } },
				};
				throw error;
			}
			if (!email) {
				const error = {
					status: 403,
					errors: { email: { kind: 'entry is empty', message: 'Data wajib diisi' } },
				};
				throw error;
			}

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

			if (!oldPassword) {
				const error = {
					status: 403,
					errors: { oldPassword: { kind: 'entry is empty', message: 'Data wajib diisi' } },
				};
				throw error;
			}
			if (!newPassword) {
				const error = {
					status: 403,
					errors: { newPassword: { kind: 'entry is empty', message: 'Data wajib diisi' } },
				};
				throw error;
			}
			if (!confirmPass) {
				const error = {
					status: 403,
					errors: { confirmPass: { kind: 'entry is empty', message: 'Data wajib diisi' } },
				};
				throw error;
			}

			if (!user) {
				res.status(404).json({
					message: 'Data tidak ditemukan !',
				});
			}
			const checkPassword = bcrypt.compareSync(oldPassword, user.password);
			if (!checkPassword) {
				return res.status(403).json({
					message: 'password yang anda masukan salah.',
					fields: { oldPassword: { message: 'password yang anda masukan salah.' } },
				});
			}

			if (newPassword !== confirmPass) {
				return res.status(403).json({
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

	generateNIS: async (req, res, next) => {
		try {
			const { kelas } = req.body;
			const getKelas = await Kelas.findOne({ _id: kelas }).populate({
				path: 'keahlian',
				select: ['paketKeahlian', 'singkatan', 'warna'],
			});

			if (getKelas) {
				const paketKeahlian = getKelas.keahlian.paketKeahlian;
				const tahunAjaran = getKelas.tahunAjaran;

				const currentTotal = await Siswa.countDocuments({
					akademikSiswa: {
						penerimaan: { paketKeahlian, tahunDiTerima: tahunAjaran },
					},
				});

				if (currentTotal === 0) {
					const suffixNIS = currentTotal + 1;
					const setLastNIS = suffixNIS.toString().padStart(4, 0);
					res.status(200).json({
						message: 'Setting NIS berhasil',
						currentTotal: currentTotal,
						data: setLastNIS,
					});
				} else {
					const siswaLast = await Siswa.findOne({
						akademikSiswa: {
							penerimaan: { paketKeahlian, tahunDiTerima: tahunAjaran },
						},
					}).sort({ NIS: -1 });

					const currentTotal = siswaLast.NIS.substr(6);
					const suffixNIS = parseInt(currentTotal) + 1;
					const setLastNIS = suffixNIS.toString().padStart(4, 0);

					res.status(200).json({
						message: 'Setting NIS berhasil',
						currentTotal: currentTotal,
						data: setLastNIS,
					});
				}
			}
		} catch (err) {
			next(err);
		}
	},

	validation: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { kelas, prefixNIS, NIS } = req.body;

			const isUser = await User.findOne({ _id: id });
			const setNIS = `${prefixNIS}${NIS}`;

			const getKelas = await Kelas.findOne({ _id: kelas }).populate({
				path: 'keahlian',
				select: ['paketKeahlian', 'singkatan', 'warna'],
			});

			if (isUser && getKelas) {
				let validasi = isUser.validasi === 'pending' ? 'valid' : 'pending';
				await User.findOneAndUpdate({ _id: id }, { validasi });

				const paketKeahlian = getKelas.keahlian.paketKeahlian;
				const tahunAjaran = getKelas.tahunAjaran;

				let xUser = await User.findOne({ _id: id });
				const { namaLengkap, NISN, tempatLahir, tanggalLahir, noHp } = xUser;
				let siswa = await Siswa({
					namaLengkap,
					NISN,
					tempatLahir,
					tanggalLahir,
					noHp,
					kelas,
					NIS: setNIS,
					akademikSiswa: {
						penerimaan: { paketKeahlian, tahunDiTerima: tahunAjaran },
					},
					user: id,
				});
				await siswa.save();

				const total = getKelas.jumlahSiswa + 1;
				await Kelas.findOneAndUpdate({ _id: kelas }, { jumlahSiswa: total });

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
			// const { page, perPage } = req.query;

			// console.log(`page,perPage`, page, perPage);
			// Get total number
			const total = await User.countDocuments({ validasi, role: 'siswa' });

			// Calculate number of pagination links required
			// const pages = Math.ceil(total / perPage);

			// Get current page number
			// const pageNumber = req.query.page == null ? 1 : page;

			// Get record to skip
			// const startFrom = (pageNumber - 1) * perPage;

			const status = validasi;

			// if (page && perPage === undefined) {
			const userValidasi = await User.find({ validasi, role: 'siswa' });
			res.status(200).json({
				message: `${total} Data user validasi '${status}' berhasil ditampilkan`,
				total: total,
				data: userValidasi,
			});
			// } else {
			// const userValidasi = await User.find({ validasi, role: 'siswa' })
			// 	.limit(perPage)
			// 	.skip(startFrom)
			// 	.exec();

			// delete userValidasi._doc.password;
			// res.status(200).json({
			// 	message: `${total} Data user validasi '${status}' berhasil ditampilkan`,
			// 	total: total,
			// 	data: userValidasi,
			// 	totalPages: pages,
			// 	currentPage: page,
			// });
			// }
		} catch (err) {
			next(err);
		}
	},

	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const user = await User.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: user,
			});
		} catch (err) {
			next(err);
		}
	},
};
