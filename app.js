var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');

const jurusanRouter = require('./app/Jurusan/router');
const kelasRouter = require('./app/Kelas/router');
const pelanggaranRouter = require('./app/Pelanggaran/router');
const siswaRouter = require('./app/Siswa/router');
const akademikSiswaRouter = require('./app/AkademikSiswa/router');
const orangTuaWaliRouter = require('./app/OrangTuaWali/router');
const kesehatanSiswaRouter = require('./app/KesehatanSiswa/router');
const selesaiPendidikanRouter = require('./app/SelesaiPendidikan/router');
const meninggalkanSekolahRouter = require('./app/MeninggalkanSekolah/router');
const pelanggaranSiswaRouter = require('./app/PelanggaranSiswa/router');
const authRouter = require('./app/Auth/router');
const userRouter = require('./app/User/router');
// const userRouter = require('./app/User/router');

var app = express();
const URL = `/api/v1`;
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// api
// app.use(`${URL}/`, userRouter);
app.use(`${URL}/jurusan`, jurusanRouter);
app.use(`${URL}/kelas`, kelasRouter);
app.use(`${URL}/pelanggaran`, pelanggaranRouter);
app.use(`${URL}/siswa`, siswaRouter);
app.use(`${URL}/akademik-siswa`, akademikSiswaRouter);
app.use(`${URL}/ortu-wali-siswa`, orangTuaWaliRouter);
app.use(`${URL}/kesehatan-siswa`, kesehatanSiswaRouter);
app.use(`${URL}/selesai-pendidikan`, selesaiPendidikanRouter);
app.use(`${URL}/meninggalkan-sekolah`, meninggalkanSekolahRouter);
app.use(`${URL}/pelanggaran-siswa`, pelanggaranSiswaRouter);
app.use(`${URL}/auth`, authRouter);
app.use(`${URL}/user`, userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	const message = err.message;
	const data = err;
	res.status(err.status || 500).json({ message: message, data: data });
	// render the error page
	// res.render('error');
});

module.exports = app;
