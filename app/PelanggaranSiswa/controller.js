const PelanggaranSiswa = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { pelanggaran, tindakan } = req.body;

			let pelanggaranSiswa = await PelanggaranSiswa({ pelanggaran, tindakan });
			await pelanggaranSiswa.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: pelanggaranSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const pelanggaranSiswa = await PelanggaranSiswa.find().populate({
				path: 'pelanggaran',
				select: ['kategori', 'jenisPelanggaran', 'jumlahPoin'],
			});
			res.status(200).json({
				message: 'Data pelanggaran siswa berhasil ditampilkan',
				data: pelanggaranSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const pelanggaranSiswa = await Siswa.findOne({ _id: id })
				.select('namaLengkap pelanggaranSiswa')
				.populate({
					path: 'pelanggaranSiswa.pelanggaran',
					select: ['kategori', 'jenisPelanggaran', 'jumlahPoin'],
				});
			if (!pelanggaranSiswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: pelanggaranSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { pelanggaran, tindakan } = req.body;

			const pelanggaranSiswa = await Siswa.findOne({ _id: id });
			if (!pelanggaranSiswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Siswa.findOneAndUpdate(
				{ _id: id },
				{
					pelanggaranSiswa: {
						pelanggaran,
						tindakan,
					},
				}
			);

			let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap pelanggaranSiswa');
			res.status(200).json({
				message: 'Data berhasil diperbarui',
				data: xSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const pelanggaranSiswa = await PelanggaranSiswa.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: pelanggaranSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
};
