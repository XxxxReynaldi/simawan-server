const Kelas = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { kode, tingkatan, keahlian, abjad, tahunAjaran, keterangan, status } = req.body;

			const isKode = await Kelas.findOne({ kode });
			if (isKode) {
				const error = {
					status: 404,
					errors: {
						kode: { kind: 'duplicate', message: 'Kode sudah terpakai, gunakan kode lain' },
					},
				};
				throw error;
			}

			const isKelas = await Kelas.findOne({ tingkatan, keahlian, abjad, tahunAjaran });
			if (isKelas) {
				const error = {
					status: 404,
					data: isKelas,
					errors: {
						tingkatan: { kind: 'duplicate', message: 'Data sudah ada' },
						keahlian: { kind: 'duplicate', message: 'Data sudah ada' },
						abjad: { kind: 'duplicate', message: 'Data sudah ada' },
						tahunAjaran: { kind: 'duplicate', message: 'Data sudah ada' },
					},
				};
				throw error;
			}

			let kelas = await Kelas({
				kode,
				tingkatan,
				keahlian,
				abjad,
				tahunAjaran,
				keterangan,
				status,
			});
			await kelas.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: kelas,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const kelas = await Kelas.find().populate({
				path: 'keahlian',
				select: ['paketKeahlian', 'singkatan', 'warna', 'kode'],
			});
			const countKelas = await Kelas.countDocuments();
			res.status(200).json({
				message: 'Data kelas berhasil ditampilkan',
				data: kelas,
				total: countKelas,
			});
		} catch (err) {
			next(err);
		}
	},
	find: async (req, res, next) => {
		try {
			const { tahunAjaran, tingkatan } = req.params;
			if (tahunAjaran && tingkatan === undefined) {
				const kelas = await Kelas.find({ tahunAjaran, status: 'Y' }).populate({
					path: 'keahlian',
					select: ['paketKeahlian', 'singkatan', 'warna'],
				});
				const countKelas = await Kelas.countDocuments({ tahunAjaran, status: 'Y' });
				res.status(200).json({
					message: `${countKelas} Data kelas berhasil ditampilkan`,
					data: kelas,
					total: countKelas,
				});
			}
			if (tahunAjaran && tingkatan) {
				const kelas = await Kelas.find({ tahunAjaran, tingkatan, status: 'Y' }).populate({
					path: 'keahlian',
					select: ['paketKeahlian', 'singkatan', 'warna'],
				});
				const countKelas = await Kelas.countDocuments({ tahunAjaran, tingkatan, status: 'Y' });
				res.status(200).json({
					message: `${countKelas} Data kelas berhasil ditampilkan`,
					data: kelas,
					total: countKelas,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const kelas = await Kelas.findOne({ _id: id }).populate('keahlian');
			if (!kelas) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: kelas,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { kode, tingkatan, keahlian, abjad, tahunAjaran, keterangan, status } = req.body;

			const kelas = await Kelas.findOne({ _id: id });
			if (!kelas) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			const isSameDoc = await Kelas.findOne({ _id: id, kode });
			if (!isSameDoc) {
				const hasKelas = await Kelas.findOne({ kode });
				if (hasKelas) {
					const error = {
						status: 404,
						data: hasKelas,
						errors: { kode: { kind: 'duplicate', message: 'Data sudah ada' } },
					};
					throw error;
				}
				await Kelas.findOneAndUpdate(
					{ _id: id },
					{ kode, tingkatan, keahlian, abjad, tahunAjaran, keterangan, status }
				);
				let updatedKelas = await Kelas.findOne({ _id: id });
				res.status(200).json({
					message: 'Data berhasil diperbarui',
					data: updatedKelas,
				});
			}

			if (isSameDoc.kode === kode) {
				const isKelas = await Kelas.findOne({
					tingkatan,
					keahlian,
					abjad,
					tahunAjaran,
					keterangan,
					status,
				});
				if (isKelas) {
					const error = {
						status: 404,
						data: isKelas,
						errors: {
							tingkatan: { kind: 'duplicate', message: 'Data sudah ada' },
							keahlian: { kind: 'duplicate', message: 'Data sudah ada' },
							abjad: { kind: 'duplicate', message: 'Data sudah ada' },
							tahunAjaran: { kind: 'duplicate', message: 'Data sudah ada' },
						},
					};
					throw error;
				}
				await Kelas.findOneAndUpdate(
					{ _id: id },
					{ tingkatan, keahlian, abjad, tahunAjaran, keterangan, status }
				);

				let updatedKelas = await Kelas.findOne({ _id: id });
				res.status(200).json({
					message: 'Data berhasil diperbarui',
					data: updatedKelas,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const kelas = await Kelas.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: kelas,
			});
		} catch (err) {
			next(err);
		}
	},
	actStatus: async (req, res, next) => {
		try {
			const { id } = req.params;
			let kelas = await Kelas.findOne({ _id: id });

			let status = kelas.status === 'Y' ? 'N' : 'Y';
			await Kelas.findOneAndUpdate({ _id: id }, { status });

			let xKelas = await Kelas.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diubah',
				data: xKelas,
			});
		} catch (err) {
			next(err);
		}
	},
	isKode: async (req, res, next) => {
		try {
			const { kode } = req.body;
			const isKode = await Kelas.findOne({ kode });
			if (isKode) {
				const error = new Error('Kode sudah terpakai, gunakan kode lain');
				error.status = 404;
				throw error;
			}
		} catch (err) {
			next(err);
		}
	},
};
