const mongoose = require('mongoose');

let siswaSchema = mongoose.Schema(
	{
		namaLengkap: {
			type: String,
			required: [true, 'Nama lengkap harus diisi'],
			maxlength: [225, 'panjang nama harus antara 3 - 225 karakter'],
			minlength: [3, 'panjang nama harus antara 3 - 225 karakter'],
		},
		NIS: {
			type: String,
			unique: true,
		},
		NISN: {
			type: String,
			required: [true, 'NISN harus diisi'],
			unique: true,
		},
		tempatLahir: {
			type: String,
			required: [true, 'Tempat lahir harus diisi'],
		},
		tanggalLahir: {
			type: Date,
			required: [true, 'Tanggal lahir harus diisi'],
		},
		jenisKelamin: {
			type: String,
		},
		agama: {
			type: String,
		},
		anakKe: {
			type: Number,
		},
		jmlSaudara: {
			type: Number,
		},
		statusTinggal: {
			type: String,
		},
		noHp: {
			type: String,
		},
		noRumah: {
			type: String,
		},
		alamat: {
			type: String,
		},
		kewarganegaraan: {
			type: String,
			enum: ['WNI', 'WNA'],
			default: 'WNI',
		},
		foto: {
			type: String,
		},
		email: {
			type: String,
			require: [true, 'email harus diisi'],
		},
		password: {
			type: String,
			require: [true, 'kata sandi harus diisi'],
			maxlength: [225, 'panjang password maksimal 225 karakter'],
		},
		role: {
			type: String,
			enum: ['admin', 'siswa'],
			default: 'siswa',
		},
		status: {
			type: String,
			enum: ['Y', 'N'],
			default: 'Y',
		},
		akademikSiswa: {
			asalSekolah: {
				namaSekolah: { type: String },
				alamatSekolah: { type: String },
				lamaBelajar: { type: Number },
				tanggalIjazah: { type: Date },
				noIjazah: { type: String },
				tanggalSTL: { type: Date },
				fileIjazah: { type: String },
			},
			penerimaan: {
				paketKeahlian: { type: String },
				tanggalDiTerima: { type: Date },
				dataSekolahPindahan: {
					dariSekolah: { type: String },
					alasan: { type: String },
				},
			},
		},
		orangTuaWali: {
			ayah: {
				nama: { type: String },
				tempatLahir: { type: String },
				tanggalLahir: { type: Date },
				alamat: { type: String },
				pendidikan: { type: String },
				agama: { type: String },
				pekerjaan: { type: String },
				penghasilan: { type: Number, default: 0 },
				noHp: { type: String },
				kewarganegaraan: { type: String, enum: ['WNI', 'WNA'], default: 'WNI' },
				statusAyah: { type: String },
			},
			ibu: {
				nama: { type: String },
				tempatLahir: { type: String },
				tanggalLahir: { type: Date },
				alamat: { type: String },
				pendidikan: { type: String },
				agama: { type: String },
				pekerjaan: { type: String },
				penghasilan: { type: Number, default: 0 },
				noHp: { type: String },
				kewarganegaraan: { type: String, enum: ['WNI', 'WNA'], default: 'WNI' },
				statusIbu: { type: String },
				statusAlamat: { type: String },
			},
			wali: {
				nama: { type: String },
				tempatLahir: { type: String },
				tanggalLahir: { type: Date },
				alamat: { type: String },
				pendidikan: { type: String },
				agama: { type: String },
				pekerjaan: { type: String },
				penghasilan: { type: Number },
				noHp: { type: String },
				kewarganegaraan: { type: String, enum: ['WNI', 'WNA'] },
				statusWali: { type: String },
				hubunganKeluarga: { type: String },
			},
		},
		kesehatanSiswa: {
			golonganDarah: { type: String },
			penyakitDiderita: { type: String },
			kelainanJasmani: { type: String },
			tinggiBadan: { type: mongoose.Schema.Types.Decimal128, default: 0 },
			beratBadan: { type: mongoose.Schema.Types.Decimal128, default: 0 },
		},
		selesaiPendidikan: {
			melanjutkanDi: { type: String },
			alasan: { type: String },
			tanggalMulaiBekerja: { type: Date },
			namaPerusahaan: { type: String },
			penghasilan: { type: Number },
			akhirPendidikan: {
				tamatBelajar: { type: Date },
				noIjazah: { type: String },
			},
		},
		perkembangan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Perkembangan_siswa',
		},
		meninggalkanSekolah: {
			tanggal: { type: Date },
			alasan: { type: String },
		},
		pelanggaranSiswa: {
			pelanggaran: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelanggaran' },
			tindakan: { type: String },
		},
		kelas: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Kelas',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Siswa', siswaSchema);
