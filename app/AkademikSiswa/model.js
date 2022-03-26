const mongoose = require('mongoose');

let akademikSiswaSchema = mongoose.Schema(
	{
		asalSekolah: {
			type: Object,
		},
		penerimaan: {
			type: Object,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Akademik_siswa', akademikSiswaSchema);
