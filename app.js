const express = require('express');   // Die express komponente ermöglicht einfaches erstellen von Routen
const session = require('express-session'); //express sessions speichern Daten in Cookies
const app = express();
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize'); //Sequelize bindet an Datenbank an
const cors = require('cors');

// Globale Variablen
const config = require('./config.json');

// Session nutzen
app.use(session({
    secret: config.sessionkey,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 3600*1000}
}));

const sequelize = new Sequelize(config.dbname, config.username, config.password, config.opts);
const models = require('./models/MainModels')(sequelize, Sequelize);

const page404 = (req, res, next) => next({status: 404});

app.use(cors());
app.use(bodyParser.json({limit: '400kb'}));
app.use(bodyParser.urlencoded({extended: false}));
if (process.env.NODE_ENV === 'dev') {
    console.log(process.env.NODE_ENV);
    sequelize
        .sync({force: true})
        .then(function (err) {
            initdb(models);
            console.log("Datenbank wurde erfolgreich neuerstellt!");
        }, function (err) {
            console.log('Beim erstellen der Datenbank ist folgender Fehler aufgetretten:', err);
        });
}

// Läuft vor anderen Routen, übergibt Modelle und Session
app.use(function (req, res, next) {
    req.models = models;
    res.locals.session = req.session;
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public folder einbinden
app.use(express.static(path.join(__dirname, 'public')));

// Routen
app.use('/cart', require('./routes/cart'));
app.use('/', require('./routes/index')); //index als Letztes, wegen Kategorie parser

// 404 abfangen
app.use(function (req, res, next) {
    next({status: 404, message: 'Not Found'});
});
// error handler
app.use(function (err, req, res, next) {
    if (err.status === 404) {
        err.message = "Die gewünschte Seite ist nicht vorhanden!";
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    res.status(err.status || 500);
    res.json({"error": res.locals.message});
});

const listener = app.listen(8080, function () {
});
module.exports = {app: app, listener: listener, sequelize: sequelize};