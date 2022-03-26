const mongoose = require('mongoose');

let jurusanSchema = mongoose.Schema(
	{
		kode: {
			type: String,
			required: [true, 'Kode harus diisi'],
		},
		bidangKeahlian: {
			type: String,
			required: [true, 'Bidang Keahlian harus diisi'],
		},
		programKeahlian: {
			type: String,
			required: [true, 'Program Keahlian harus diisi'],
		},
		paketKeahlian: {
			type: String,
			required: [true, 'Paket Keahlian harus diisi'],
		},
		singkatan: {
			type: String,
			required: [true, 'Singkatan harus diisi'],
		},
		foto: {
			type: String,
			// required: [true, 'Foto harus diisi'],
		},
		warna: {
			type: String,
		},
		status: {
			type: String,
			enum: ['Y', 'N'],
			default: 'Y',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Jurusan', jurusanSchema);
