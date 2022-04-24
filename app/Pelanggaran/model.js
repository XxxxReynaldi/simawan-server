const mongoose = require('mongoose');

let pelanggaranSchema = mongoose.Schema(
	{
		kategori: {
			type: String,
			required: [true, 'kategori harus diisi'],
		},
		jenisPelanggaran: {
			type: String,
			required: [true, 'Jenis Pelanggaran harus diisi'],
		},
		jumlahPoin: {
			type: Number,
			required: [true, 'Jumlah harus diisi'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Pelanggaran', pelanggaranSchema);
