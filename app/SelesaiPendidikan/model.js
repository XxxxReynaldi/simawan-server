const mongoose = require('mongoose');

let selesaiPendidikanSchema = mongoose.Schema(
	{
		melanjutkanDi: {
			type: String,
		},
		alasan: {
			type: String,
		},
		tanggalMulaiBekerja: {
			type: Date,
		},
		namaPerusahaan: {
			type: String,
		},
		penghasilan: {
			type: Number,
		},
		akhirPendidikan: {
			type: Object,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Selesai_pendidikan', selesaiPendidikanSchema);
