const mongoose = require('mongoose');

let perkembanganSiswaSchema = mongoose.Schema(
	{
		menerimaBeasiswa: {
			type: Object,
		},
		KPS: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Perkembangan_siswa', perkembanganSiswaSchema);
