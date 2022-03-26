const AkademikSiswa = require('./model');
const Siswa = require('../Siswa/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
	store: async (req, res, next) => {
		try {
			const {
				namaSekolah,
				alamatSekolah,
				lamaBelajar,
				tanggalIjazah,
				noIjazah,
				tanggalSTL,
				paketKeahlian,
				tanggalDiTerima,
				dariSekolah,
				alasan,
			} = req.body;

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(
					config.rootPath,
					`public/documents/ijazah_sekolah_asal/${filename}`
				);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						const akademikSiswa = await AkademikSiswa({
							asalSekolah: {
								namaSekolah,
								alamatSekolah,
								lamaBelajar,
								tanggalIjazah,
								noIjazah,
								tanggalSTL,
								fileIjazah: filename,
							},
							penerimaan: {
								paketKeahlian,
								tanggalDiTerima,
								dataSekolahPindahan: { dariSekolah, alasan },
							},
						});
						await akademikSiswa.save();
						res.status(201).json({
							message: 'Data berhasil disimpan',
							data: akademikSiswa,
						});
					} catch (err) {
						next(err);
					}
				});
			} else {
				const akademikSiswa = await AkademikSiswa({
					asalSekolah: { namaSekolah, alamatSekolah, lamaBelajar, tanggalIjazah, noIjazah, tanggalSTL },
					penerimaan: { paketKeahlian, tanggalDiTerima, dataSekolahPindahan: { dariSekolah, alasan } },
				});
				await akademikSiswa.save();
				res.status(201).json({
					message: 'Data berhasil disimpan',
					data: akademikSiswa,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const akademikSiswa = await AkademikSiswa.find().populate({
				path: 'penerimaan.paketKeahlian',
				model: 'Jurusan',
				select: ['paketKeahlian', 'singkatan'],
			});

			res.status(200).json({
				message: 'Data akademik siswa berhasil ditampilkan',
				data: akademikSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const akademikSiswa = await Siswa.findOne({ _id: id })
				.select('namaLengkap akademikSiswa')
				.populate({
					path: 'akademikSiswa.penerimaan.paketKeahlian',
					model: 'Jurusan',
					select: ['paketKeahlian', 'singkatan'],
				});

			if (!akademikSiswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: akademikSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				namaSekolah,
				alamatSekolah,
				lamaBelajar,
				tanggalIjazah,
				noIjazah,
				tanggalSTL,
				paketKeahlian,
				tanggalDiTerima,
				dariSekolah,
				alasan,
			} = req.body;

			const siswa = await Siswa.findOne({ _id: id });
			if (!siswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(
					config.rootPath,
					`public/documents/ijazah_sekolah_asal/${filename}`
				);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				try {
					let currentImage = `${config.rootPath}/public/documents/ijazah_sekolah_asal/${siswa.akademikSiswa.asalSekolah.fileIjazah}`;
					if (fs.existsSync(currentImage)) {
						fs.unlinkSync(currentImage);
					}

					await Siswa.findOneAndUpdate(
						{ _id: id },
						{
							akademikSiswa: {
								asalSekolah: {
									namaSekolah,
									alamatSekolah,
									lamaBelajar,
									tanggalIjazah,
									noIjazah,
									tanggalSTL,
									fileIjazah: filename,
								},
								penerimaan: {
									paketKeahlian,
									tanggalDiTerima,
									dataSekolahPindahan: { dariSekolah, alasan },
								},
							},
						}
					);

					let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap akademikSiswa');
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
						akademikSiswa: {
							asalSekolah: {
								namaSekolah,
								alamatSekolah,
								lamaBelajar,
								tanggalIjazah,
								noIjazah,
								tanggalSTL,
								fileIjazah: siswa.akademikSiswa.asalSekolah.fileIjazah || null,
							},
							penerimaan: {
								paketKeahlian,
								tanggalDiTerima,
								dataSekolahPindahan: { dariSekolah, alasan },
							},
						},
					}
				);

				let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap akademikSiswa');
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
			const akademikSiswa = await AkademikSiswa.findOneAndRemove({ _id: id });
			let currentImage = `${config.rootPath}/public/documents/ijazah_sekolah_asal/${akademikSiswa.asalSekolah.fileIjazah}`;
			if (fs.existsSync(currentImage)) {
				fs.unlinkSync(currentImage);
			}
			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: akademikSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
};
