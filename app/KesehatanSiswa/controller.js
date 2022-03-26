const KesehatanSiswa = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { golonganDarah, penyakitDiderita, kelainanJasmani } = req.body;
			const tinggiBadan = parseFloat(req.body.tinggiBadan);
			const beratBadan = parseFloat(req.body.beratBadan);

			let kesehatanSiswa = await KesehatanSiswa({
				golonganDarah,
				penyakitDiderita,
				kelainanJasmani,
				tinggiBadan,
				beratBadan,
			});
			await kesehatanSiswa.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: kesehatanSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const kesehatanSiswa = await KesehatanSiswa.find();
			res.status(200).json({
				message: 'Data kesehatan siswa berhasil ditampilkan',
				data: kesehatanSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const kesehatanSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap kesehatanSiswa');
			if (!kesehatanSiswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: kesehatanSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { golonganDarah, penyakitDiderita, kelainanJasmani, tinggiBadan, beratBadan } = req.body;

			const kesehatanSiswa = await Siswa.findOne({ _id: id });
			if (!kesehatanSiswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Siswa.findOneAndUpdate(
				{ _id: id },
				{
					kesehatanSiswa: {
						golonganDarah,
						penyakitDiderita,
						kelainanJasmani,
						tinggiBadan,
						beratBadan,
					},
				}
			);

			let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap kesehatanSiswa');
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
			const kesehatanSiswa = await KesehatanSiswa.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: kesehatanSiswa,
			});
		} catch (err) {
			next(err);
		}
	},
};
