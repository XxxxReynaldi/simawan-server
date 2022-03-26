const mongoose = require('mongoose');

let pelanggaranSchema = mongoose.Schema(
	{
		kategori: {
			type: String,
		},
		jenisPelanggaran: {
			type: String,
		},
		jumlahPoin: {
			type: Number,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Pelanggaran', pelanggaranSchema);
