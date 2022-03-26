const MeninggalkanSekolah = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { tanggal, alasan } = req.body;

			let meninggalkanSekolah = await MeninggalkanSekolah({ tanggal, alasan });
			await meninggalkanSekolah.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: meninggalkanSekolah,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const meninggalkanSekolah = await MeninggalkanSekolah.find();
			res.status(200).json({
				message: 'Data meninggalkan sekolah berhasil ditampilkan',
				data: meninggalkanSekolah,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const meninggalkanSekolah = await Siswa.findOne({ _id: id }).select(
				'namaLengkap meninggalkanSekolah'
			);
			if (!meninggalkanSekolah) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: meninggalkanSekolah,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { tanggal, alasan } = req.body;

			const meninggalkanSekolah = await Siswa.findOne({ _id: id });
			if (!meninggalkanSekolah) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Siswa.findOneAndUpdate(
				{ _id: id },
				{
					meninggalkanSekolah: {
						tanggal,
						alasan,
					},
				}
			);

			let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap meninggalkanSekolah');
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
			const meninggalkanSekolah = await MeninggalkanSekolah.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: meninggalkanSekolah,
			});
		} catch (err) {
			next(err);
		}
	},
};
