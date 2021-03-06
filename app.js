var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require ('express-partials');
var methodOverride = require ('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//helpers dinamicos
app.use(function(req, res, next){
    
    // si no existe lo inicializa
   if (!req.session.redir) {
       req.session.redir = '/';
   }
    
    //guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout|\/user/)){ 
        req.session.redir = req.path; //guarda la ruta para poder redireccionar a la vista anterior
    }
    
    //hacer visible req.session en las vistas
    res.locals.session = req.session; //copia la sesión para que esté accesible en la vistas    
    next();
});


app.use (function(req, res, next){
    
        //si existe un usuario
        if (req.session.user){ 
            // y está declarado el tiempo
            if(req.session.user.inicio){
                var actual = new Date().getTime();
                if ((actual - req.session.user.inicio) >= 120000){
                    req.session.user = undefined;
                }else{
                    req.session.user.inicio = new Date().getTime();
                }
            }else{
                req.session.user.inicio = new Date().getTime();
            }
        }
    next();
});


app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;

































