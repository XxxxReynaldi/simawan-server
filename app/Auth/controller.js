const User = require('../User/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	signup: async (req, res, next) => {
		try {
			const payload = req.body;

			if (req.file) {
				let filepath = req.file.path;
				let filename = `${new Date().getTime()}-${req.file.originalname}`;
				let target_path = path.resolve(config.rootPath, `public/images/user/${filename}`);

				const src = fs.createReadStream(filepath);
				const dest = fs.createWriteStream(target_path);

				src.pipe(dest);

				src.on('end', async () => {
					try {
						const user = new User({ ...payload, foto: filename });

						await user.save();

						delete user._doc.password;

						res.status(201).json({ data: user });
					} catch (err) {
						if (err && err.name === 'ValidationError') {
							return res.status(422).json({
								error: true,
								message: err.message,
								fields: err.errors,
							});
						}
						next(err);
					}
				});
			} else {
				let user = new User({ ...payload, foto: 'default.jpg' });
				await user.save();

				delete user._doc.password;

				res.status(201).json({ data: user });
			}
		} catch (err) {
			if (err && err.name === 'ValidationError') {
				return res.status(422).json({
					error: true,
					message: err.message,
					fields: err.errors,
				});
			}
			next(err);
		}
	},

	signin: (req, res, next) => {
		const { email, password } = req.body;
		console.log('email,password', email, password);
		User.findOne({ email: email })
			.then((user) => {
				if (user) {
					const checkPassword = bcrypt.compareSync(password, user.password);
					if (checkPassword) {
						const token = jwt.sign(
							{
								user: {
									id: user.id,
									// email: user.email,
									namaLengkap: user.namaLengkap,
									telp: user.telp,
									foto: user.foto,
									role: user.role,
								},
							},
							config.jwtKey
						);

						res.status(200).json({
							data: { token },
						});
					} else {
						res.status(403).json({
							message: 'password yang anda masukan salah.',
							fields: { password: { message: 'password yang anda masukan salah.' } },
						});
					}
				} else {
					res.status(403).json({
						message: 'email yang anda masukan belum terdaftar.',
						fields: { email: { message: 'email yang anda masukan belum terdaftar.' } },
					});
				}
			})
			.catch((err) => {
				res.status(500).json({
					message: err.message || `Internal server error`,
				});

				next();
			});
	},
};
