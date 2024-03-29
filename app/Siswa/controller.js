const Siswa = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
	store: async (req, res, next) => {
		try {
			const {
				namaLengkap,
				NIS,
				NISN,
				tempatLahir,
				tanggalLahir,
				jenisKelamin,
				agama,
				anakKe,
				jmlSaudara,
				statusTinggal,
				noHp,
				noRumah,
				alamat,
				kewarganegaraan,
			} = req.body;

			const checkNIS = await Siswa.findOne({ NIS });
			if (checkNIS) {
				const error = new Error('nis sudah terpakai, gunakan nis lain');
				error.status = 404;
				throw error;
			}

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/siswa/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						let siswa = await Siswa({
							namaLengkap,
							NIS,
							NISN,
							tempatLahir,
							tanggalLahir,
							jenisKelamin,
							agama,
							anakKe,
							jmlSaudara,
							statusTinggal,
							noHp,
							noRumah,
							alamat,
							kewarganegaraan,
							foto: filename,
						});
						await siswa.save();
						res.status(201).json({
							message: 'Data berhasil disimpan',
							data: siswa,
						});
					} catch (err) {
						next(err);
					}
				});
			} else {
				let siswa = await Siswa({
					namaLengkap,
					NIS,
					NISN,
					tempatLahir,
					tanggalLahir,
					jenisKelamin,
					agama,
					anakKe,
					jmlSaudara,
					statusTinggal,
					noHp,
					noRumah,
					alamat,
					kewarganegaraan,
				});
				await siswa.save();
				res.status(201).json({
					message: 'Data berhasil disimpan',
					data: siswa,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const siswa = await Siswa.find().populate({
				path: 'kelas',
				select: ['tingkatan', 'keahlian', 'abjad'],
				populate: {
					path: 'keahlian',
					model: 'Jurusan',
					select: ['paketKeahlian', 'singkatan', 'warna'],
				},
			});

			// .populate({ path: 'akademik' })
			// .populate({ path: 'orangTuaWali' })
			// .populate({ path: 'kesehatan' })
			// .populate({ path: 'selesaiPendidikan' })
			// .populate({ path: 'perkembangan' })
			// .populate({ path: 'meninggalkanSekolah' })
			// .populate({ path: 'pelanggaran' });

			const totalSiswa = await Siswa.countDocuments();
			res.status(200).json({
				message: 'Data siswa berhasil ditampilkan',
				total: totalSiswa,
				data: siswa,
			});
		} catch (err) {
			next(err);
		}
	},
	find: async (req, res, next) => {
		try {
			const { tahunAjaran, kelas } = req.params;
			if (tahunAjaran && kelas === undefined) {
				const siswa = await Siswa.find({ tahunAjaran, status: 'Y' }).populate({
					path: 'kelas',
					select: ['tingkatan', 'keahlian', 'abjad'],
					populate: {
						path: 'keahlian',
						model: 'Jurusan',
						select: ['paketKeahlian', 'singkatan', 'warna'],
					},
				});
				const countSiswa = await Siswa.countDocuments({ tahunAjaran, status: 'Y' });
				res.status(200).json({
					message: `${countSiswa} Data siswa berhasil ditampilkan`,
					data: siswa,
					total: countSiswa,
				});
			}
			if (tahunAjaran && kelas) {
				const siswa = await Siswa.find({ tahunAjaran, kelas, status: 'Y' }).populate({
					path: 'kelas',
					select: ['tingkatan', 'keahlian', 'abjad'],
					populate: {
						path: 'keahlian',
						model: 'Jurusan',
						select: ['paketKeahlian', 'singkatan', 'warna'],
					},
				});
				const countSiswa = await Siswa.countDocuments({ tahunAjaran, kelas, status: 'Y' });
				res.status(200).json({
					message: `${countSiswa} Data siswa berhasil ditampilkan`,
					data: siswa,
					total: countSiswa,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const siswa = await Siswa.findOne({ _id: id });
			// .populate({ path: 'akademik' })
			// .populate({ path: 'orangTuaWali' })
			// .populate({ path: 'kesehatan' })
			// .populate({ path: 'selesaiPendidikan' })
			// .populate({ path: 'perkembangan' })
			// .populate({ path: 'meninggalkanSekolah' })
			// .populate({ path: 'pelanggaran' });
			if (!siswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: siswa,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				namaLengkap,
				NIS,
				NISN,
				tempatLahir,
				tanggalLahir,
				jenisKelamin,
				agama,
				anakKe,
				jmlSaudara,
				statusTinggal,
				noHp,
				noRumah,
				alamat,
				kewarganegaraan,
			} = req.body;

			const siswa = await Siswa.findOne({ _id: id });
			if (!siswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			const checkNIS = await Siswa.findOne({ NIS });
			if (checkNIS) {
				const error = new Error('NIS sudah terpakai, gunakan nis lain');
				error.status = 404;
				throw error;
			}

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/siswa/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				try {
					let currentImage = `${config.rootPath}/public/images/siswa/${siswa.foto}`;
					if (fs.existsSync(currentImage)) {
						fs.unlinkSync(currentImage);
					}

					await Siswa.findOneAndUpdate(
						{ _id: id },
						{
							namaLengkap,
							NIS,
							NISN,
							tempatLahir,
							tanggalLahir,
							jenisKelamin,
							agama,
							anakKe,
							jmlSaudara,
							statusTinggal,
							noHp,
							noRumah,
							alamat,
							kewarganegaraan,
							foto: filename,
						}
					);

					let xSiswa = await Siswa.findOne({ _id: id });
					res.status(200).json({
						message: 'Data berhasil diperbarui',
						data: xSiswa,
					});
				} catch (err) {
					next(err);
				}
			} else {
				await Siswa.findOneAndUpdate(
					{ _id: id },
					{
						namaLengkap,
						NIS,
						NISN,
						tempatLahir,
						tanggalLahir,
						jenisKelamin,
						agama,
						anakKe,
						jmlSaudara,
						statusTinggal,
						noHp,
						noRumah,
						alamat,
						kewarganegaraan,
					}
				);

				let xSiswa = await Siswa.findOne({ _id: id });
				res.status(200).json({
					message: 'Data berhasil diperbarui',
					data: xSiswa,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const siswa = await Siswa.findOneAndRemove({ _id: id });
			let currentImage = `${config.rootPath}/public/images/siswa/${siswa.foto}`;
			if (fs.existsSync(currentImage)) {
				fs.unlinkSync(currentImage);
			}

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: siswa,
			});
		} catch (err) {
			next(err);
		}
	},
	actStatus: async (req, res, next) => {
		try {
			const { id } = req.params;
			let siswa = await Siswa.findOne({ _id: id });

			let status = siswa.status === 'Y' ? 'N' : 'Y';
			await Siswa.findOneAndUpdate({ _id: id }, { status });

			let xSiswa = await Siswa.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diubah',
				data: xSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	checkKode: async (req, res, next) => {
		try {
			const { nis } = req.body;
			const checkNIS = await Siswa.findOne({ nis });
			if (checkNIS) {
				const error = new Error('nis sudah terpakai, gunakan nis lain');
				error.status = 404;
				throw error;
			}
		} catch (err) {
			next(err);
		}
	},
};
