const mongoose = require('mongoose');

let kesehatanSiswaSchema = mongoose.Schema(
	{
		golonganDarah: {
			type: String,
		},
		penyakitDiderita: {
			type: String,
		},
		kelainanJasmani: {
			type: String,
		},
		tinggiBadan: {
			type: mongoose.Schema.Types.Decimal128,
		},
		beratBadan: {
			type: mongoose.Schema.Types.Decimal128,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Kesehatan_siswa', kesehatanSiswaSchema);
