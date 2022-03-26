const Pelanggaran = require('./model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { kategori, jenisPelanggaran, jumlahPoin } = req.body;

			let pelanggaran = await Pelanggaran({ kategori, jenisPelanggaran, jumlahPoin });
			await pelanggaran.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: pelanggaran,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const pelanggaran = await Pelanggaran.find();
			res.status(200).json({
				message: 'Data pelanggaran berhasil ditampilkan',
				data: pelanggaran,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const pelanggaran = await Pelanggaran.findOne({ _id: id });
			if (!pelanggaran) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: pelanggaran,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { kategori, jenisPelanggaran, jumlahPoin } = req.body;

			const pelanggaran = await Pelanggaran.findOne({ _id: id });
			if (!pelanggaran) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Pelanggaran.findOneAndUpdate({ _id: id }, { kategori, jenisPelanggaran, jumlahPoin });

			let xPelanggaran = await Pelanggaran.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diperbarui',
				data: xPelanggaran,
			});
		} catch (err) {
			next(err);
		}
	},
	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const pelanggaran = await Pelanggaran.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: pelanggaran,
			});
		} catch (err) {
			next(err);
		}
	},
};
