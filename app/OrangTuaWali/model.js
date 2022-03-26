const mongoose = require('mongoose');

let ortuWaliSchema = mongoose.Schema(
	{
		ayah: {
			type: Object,
		},
		ibu: {
			type: Object,
		},
		wali: {
			type: Object,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Orang_tua_wali', ortuWaliSchema);
