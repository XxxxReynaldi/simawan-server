const mongoose = require('mongoose');

let kelasSchema = mongoose.Schema(
	{
		kode: {
			type: String,
			required: [true, 'Kode harus diisi'],
		},
		tingkatan: {
			type: String,
			required: [true, 'Tingkatan harus diisi'],
		},
		keahlian: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Jurusan',
			required: [true, 'Keahlian harus diisi'],
		},
		abjad: {
			type: String,
			required: [true, 'Abjad harus diisi'],
		},
		tahunAjaran: {
			type: String,
			required: [true, 'Tahun Ajaran harus diisi'],
		},
		keterangan: {
			type: String,
		},
		jumlahSiswa: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['Y', 'N'],
			default: 'Y',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Kelas', kelasSchema);
