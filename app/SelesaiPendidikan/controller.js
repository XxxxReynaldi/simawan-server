const SelesaiPendidikan = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const {
				melanjutkanDi,
				alasan,
				tanggalMulaiBekerja,
				namaPerusahaan,
				penghasilan,
				tamatBelajar,
				noIjazah,
			} = req.body;

			let selesaiPendidikan = await SelesaiPendidikan({
				melanjutkanDi,
				alasan,
				tanggalMulaiBekerja,
				namaPerusahaan,
				penghasilan,
				akhirPendidikan: {
					tamatBelajar,
					noIjazah,
				},
			});
			await selesaiPendidikan.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: selesaiPendidikan,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const selesaiPendidikan = await SelesaiPendidikan.find();
			res.status(200).json({
				message: 'Data selesai pendidikan berhasil ditampilkan',
				data: selesaiPendidikan,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const selesaiPendidikan = await Siswa.findOne({ _id: id }).select(
				'namaLengkap selesaiPendidikan'
			);
			if (!selesaiPendidikan) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: selesaiPendidikan,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				melanjutkanDi,
				alasan,
				tanggalMulaiBekerja,
				namaPerusahaan,
				penghasilan,
				tamatBelajar,
				noIjazah,
			} = req.body;

			const selesaiPendidikan = await Siswa.findOne({ _id: id });
			if (!selesaiPendidikan) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Siswa.findOneAndUpdate(
				{ _id: id },
				{
					selesaiPendidikan: {
						melanjutkanDi,
						alasan,
						tanggalMulaiBekerja,
						namaPerusahaan,
						penghasilan,
						akhirPendidikan: {
							tamatBelajar,
							noIjazah,
						},
					},
				}
			);

			let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap selesaiPendidikan');
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
			const selesaiPendidikan = await SelesaiPendidikan.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: selesaiPendidikan,
			});
		} catch (err) {
			next(err);
		}
	},
};
