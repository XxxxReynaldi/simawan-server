const mongoose = require('mongoose');

let meninggalkanSekolahSchema = mongoose.Schema(
	{
		tanggal: {
			type: Date,
		},
		alasan: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Meninggalkan_sekolah', meninggalkanSekolahSchema);
