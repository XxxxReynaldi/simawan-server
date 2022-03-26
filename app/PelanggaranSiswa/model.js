const mongoose = require('mongoose');

let pelanggaranSiswaSchema = mongoose.Schema(
	{
		pelanggaran: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pelanggaran',
		},
		tindakan: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Pelanggaran_siswa', pelanggaranSiswaSchema);
