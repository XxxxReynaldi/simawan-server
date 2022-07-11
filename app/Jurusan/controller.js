const Jurusan = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
	store: async (req, res, next) => {
		try {
			const { kode, bidangKeahlian, programKeahlian, paketKeahlian, singkatan, status, warna } =
				req.body;

			const checkKode = await Jurusan.findOne({ kode });
			if (checkKode) {
				const error = {
					status: 404,
					data: checkKode,
					errors: {
						kode: { kind: 'duplicate', message: 'Kode sudah terpakai, gunakan kode lain' },
					},
				};
				throw error;
			}

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/jurusan/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				// checkImage(filepath);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						let jurusan = await Jurusan({
							kode,
							bidangKeahlian,
							programKeahlian,
							paketKeahlian,
							singkatan,
							warna,
							status,
							foto: filename,
						});
						await jurusan.save();

						res.status(201).json({
							message: 'Data berhasil disimpan',
							data: jurusan,
						});
					} catch (err) {
						next(err);
					}
				});
			} else {
				let jurusan = await Jurusan({
					kode,
					bidangKeahlian,
					programKeahlian,
					paketKeahlian,
					singkatan,
					warna,
					status,
					foto: 'default.png',
				});
				await jurusan.save();
				res.status(201).json({
					message: 'Data berhasil disimpan',
					data: jurusan,
				});
			}
		} catch (err) {
			next(err);
		}
	},
	index: async (req, res, next) => {
		try {
			const jurusan = await Jurusan.find();
			const countJurusan = await Jurusan.countDocuments();
			res.status(200).json({
				message: 'Data jurusan berhasil ditampilkan',
				data: jurusan,
				total: countJurusan,
			});
		} catch (err) {
			next(err);
		}
	},
	show: async (req, res, next) => {
		try {
			const { id } = req.params;
			const jurusan = await Jurusan.findOne({ _id: id });
			if (!jurusan) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}
			res.status(200).json({
				message: 'Data berhasil ditemukan',
				data: jurusan,
			});
		} catch (err) {
			next(err);
		}
	},
	update: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { kode, bidangKeahlian, programKeahlian, paketKeahlian, singkatan, status, warna } =
				req.body;

			const jurusan = await Jurusan.findOne({ _id: id });
			if (!jurusan) {
				const error = new Error('Data tidak ditemukan !');
				error.status = 404;
				throw error;
			}

			const isSameDoc = await Jurusan.findOne({ _id: id, kode });
			// Jika mengubah dokumen yang berbeda
			if (!isSameDoc) {
				const hasJurusan = await Jurusan.findOne({ kode });
				if (hasJurusan) {
					const error = {
						status: 404,
						data: hasJurusan,
						errors: { kode: { kind: 'duplicate', message: 'Data sudah ada' } },
					};
					throw error;
				}
				if (req.file) {
					let filepath = req.file.path;
					let filename = `${new Date().getTime()}-${req.file.originalname}`;
					let target_path = path.resolve(config.rootPath, `public/images/jurusan/${filename}`);

					const src = fs.createReadStream(filepath);
					const dest = fs.createWriteStream(target_path);

					src.pipe(dest);

					src.on('end', async () => {
						try {
							let currentImage = `${config.rootPath}/public/images/jurusan/${jurusan.foto}`;
							if (fs.existsSync(currentImage)) {
								fs.unlinkSync(currentImage);
							}

							await Jurusan.findOneAndUpdate(
								{
									_id: id,
								},
								{
									kode,
									bidangKeahlian,
									programKeahlian,
									paketKeahlian,
									singkatan,
									warna,
									status,
									foto: filename,
								}
							);

							let xJurusan = await Jurusan.findOne({ _id: id });

							res.status(200).json({
								message: 'Data berhasil diperbarui',
								data: xJurusan,
							});
						} catch (err) {
							next(err);
						}
					});
				} else {
					await Jurusan.findOneAndUpdate(
						{ _id: id },
						{
							kode,
							bidangKeahlian,
							programKeahlian,
							paketKeahlian,
							singkatan,
							warna,
							status,
							foto: jurusan.foto,
						}
					);

					let xJurusan = await Jurusan.findOne({ _id: id });
					res.status(200).json({
						message: 'Data berhasil diperbarui',
						data: xJurusan,
					});
				}
			}

			// Jika inputan kode sama
			if (isSameDoc.kode === kode) {
				if (req.file) {
					let filepath = req.file.path;
					let filename = `${new Date().getTime()}-${req.file.originalname}`;
					let target_path = path.resolve(config.rootPath, `public/images/jurusan/${filename}`);

					const src = fs.createReadStream(filepath);
					const dest = fs.createWriteStream(target_path);

					src.pipe(dest);

					src.on('end', async () => {
						try {
							let currentImage = `${config.rootPath}/public/images/jurusan/${jurusan.foto}`;
							if (fs.existsSync(currentImage)) {
								fs.unlinkSync(currentImage);
							}

							await Jurusan.findOneAndUpdate(
								{
									_id: id,
								},
								{
									bidangKeahlian,
									programKeahlian,
									paketKeahlian,
									singkatan,
									warna,
									status,
									foto: filename,
								}
							);

							let xJurusan = await Jurusan.findOne({ _id: id });

							res.status(200).json({
								message: 'Data berhasil diperbarui',
								data: xJurusan,
							});
						} catch (err) {
							next(err);
						}
					});
				} else {
					await Jurusan.findOneAndUpdate(
						{ _id: id },
						{
							bidangKeahlian,
							programKeahlian,
							paketKeahlian,
							singkatan,
							warna,
							status,
							foto: jurusan.foto,
						}
					);

					let xJurusan = await Jurusan.findOne({ _id: id });
					res.status(200).json({
						message: 'Data berhasil diperbarui',
						data: xJurusan,
					});
				}
			}
		} catch (err) {
			next(err);
		}
	},
	destroy: async (req, res, next) => {
		try {
			const { id } = req.params;
			const jurusan = await Jurusan.findOneAndRemove({ _id: id });
			let currentImage = `${config.rootPath}/public/images/jurusan/${jurusan.foto}`;
			if (fs.existsSync(currentImage)) {
				fs.unlinkSync(currentImage);
			}
			res.status(200).json({
				message: 'Data berhasil dihapus',
				data: jurusan,
			});
		} catch (err) {
			next(err);
		}
	},
	actStatus: async (req, res, next) => {
		try {
			const { id } = req.params;
			let jurusan = await Jurusan.findOne({ _id: id });

			let status = jurusan.status === 'Y' ? 'N' : 'Y';
			await Jurusan.findOneAndUpdate({ _id: id }, { status });

			let xJurusan = await Jurusan.findOne({ _id: id });
			res.status(200).json({
				message: 'Data berhasil diubah',
				data: xJurusan,
			});
		} catch (err) {
			next(err);
		}
	},
};

// const checkImage = (filepath) => {
// 	console.log(`platform: `, process.platform);
// 	console.log(`filepath: `, filepath);
// 	console.log(`dir name: `, __dirname);
// 	console.log(`extension: `, path.extname(filepath));
// 	console.log(`file: `, path.basename(filepath));
// 	console.log(`dir: `, path.dirname(filepath));
// 	console.log(`resolve: `, path.resolve(filepath));
// };
