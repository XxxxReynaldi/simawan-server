const OrangTuaWali = require('./model');
const Siswa = require('../Siswa/model');

module.exports = {
	store: async (req, res, next) => {
		try {
			const {
				namaA,
				tempatLahirA,
				tanggalLahirA,
				alamatA,
				pendidikanA,
				agamaA,
				pekerjaanA,
				noHpA,
				kewarganegaraanA,
				statusAyah,
				namaI,
				tempatLahirI,
				tanggalLahirI,
				alamatI,
				pendidikanI,
				agamaI,
				pekerjaanI,
				noHpI,
				kewarganegaraanI,
				statusIbu,
				statusAlamatI,
				namaW,
				tempatLahirW,
				tanggalLahirW,
				alamatW,
				pendidikanW,
				agamaW,
				pekerjaanW,
				noHpW,
				kewarganegaraanW,
				statusWali,
				hubunganKeluarga,
			} = req.body;
			const penghasilanA = parseInt(req.body.penghasilanA);
			const penghasilanI = parseInt(req.body.penghasilanI);
			const penghasilanW = parseInt(req.body.penghasilanW);

			let orangTuaWali = await OrangTuaWali({
				ayah: {
					nama: namaA,
					tempatLahir: tempatLahirA,
					tanggalLahir: tanggalLahirA,
					alamat: alamatA,
					pendidikan: pendidikanA,
					agama: agamaA,
					pekerjaan: pekerjaanA,
					penghasilan: penghasilanA,
					noHp: noHpA,
					kewarganegaraan: kewarganegaraanA,
					statusAyah,
				},
				ibu: {
					nama: namaI,
					tempatLahir: tempatLahirI,
					tanggalLahir: tanggalLahirI,
					alamat: alamatI,
					pendidikan: pendidikanI,
					agama: agamaI,
					pekerjaan: pekerjaanI,
					penghasilan: penghasilanI,
					noHp: noHpI,
					kewarganegaraan: kewarganegaraanI,
					statusIbu,
					statusAlamat: statusAlamatI,
				},
				wali: {
					nama: namaW,
					tempatLahir: tempatLahirW,
					tanggalLahir: tanggalLahirW,
					alamat: alamatW,
					pendidikan: pendidikanW,
					agama: agamaW,
					pekerjaan: pekerjaanW,
					penghasilan: penghasilanW,
					noHp: noHpW,
					kewarganegaraan: kewarganegaraanW,
					statusWali,
					hubunganKeluarga,
				},
			});
			await orangTuaWali.save();
			res.status(201).json({
				message: 'Data berhasil disimpan',
				data: orangTuaWali,
			});
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const orangTuaWali = await OrangTuaWali.find();
			res.status(200).json({
				message: 'Data orang tua/wali berhasil ditampilkan',
				data: orangTuaWali,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const orangTuaWali = await Siswa.findOne({ _id: id }).select('namaLengkap orangTuaWali');
			if (!orangTuaWali) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: orangTuaWali,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				namaA,
				tempatLahirA,
				tanggalLahirA,
				alamatA,
				pendidikanA,
				agamaA,
				pekerjaanA,
				penghasilanA,
				noHpA,
				kewarganegaraanA,
				statusAyah,
				namaI,
				tempatLahirI,
				tanggalLahirI,
				alamatI,
				pendidikanI,
				agamaI,
				pekerjaanI,
				penghasilanI,
				noHpI,
				kewarganegaraanI,
				statusIbu,
				statusAlamatI,
				namaW,
				tempatLahirW,
				tanggalLahirW,
				alamatW,
				pendidikanW,
				agamaW,
				pekerjaanW,
				penghasilanW,
				noHpW,
				kewarganegaraanW,
				statusWali,
				hubunganKeluarga,
			} = req.body;

			const siswa = await Siswa.findOne({ _id: id });
			if (!siswa) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			await Siswa.findOneAndUpdate(
				{ _id: id },
				{
					orangTuaWali: {
						ayah: {
							nama: namaA,
							tempatLahir: tempatLahirA,
							tanggalLahir: tanggalLahirA,
							alamat: alamatA,
							pendidikan: pendidikanA,
							agama: agamaA,
							pekerjaan: pekerjaanA,
							penghasilan: penghasilanA,
							noHp: noHpA,
							kewarganegaraan: kewarganegaraanA,
							statusAyah,
						},
						ibu: {
							nama: namaI,
							tempatLahir: tempatLahirI,
							tanggalLahir: tanggalLahirI,
							alamat: alamatI,
							pendidikan: pendidikanI,
							agama: agamaI,
							pekerjaan: pekerjaanI,
							penghasilan: penghasilanI,
							noHp: noHpI,
							kewarganegaraan: kewarganegaraanI,
							statusIbu,
							statusAlamat: statusAlamatI,
						},
						wali: {
							nama: namaW,
							tempatLahir: tempatLahirW,
							tanggalLahir: tanggalLahirW,
							alamat: alamatW,
							pendidikan: pendidikanW,
							agama: agamaW,
							pekerjaan: pekerjaanW,
							penghasilan: penghasilanW,
							noHp: noHpW,
							kewarganegaraan: kewarganegaraanW,
							statusWali,
							hubunganKeluarga,
						},
					},
				}
			);

			let xSiswa = await Siswa.findOne({ _id: id }).select('namaLengkap orangTuaWali');
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
			const orangTuaWali = await OrangTuaWali.findOneAndRemove({ _id: id });

			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: orangTuaWali,
			});
		} catch (err) {
			next(err);
		}
	},
};
