var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

require('./config/passport');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping?readPreference=primary&appname=MongoDB%20Compass&ssl=false',{useUnifiedTopology: true,useNewUrlParser: true});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'brylixOnline',
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}), // save session in current opn db
  cookie: { maxAge: 180 * 60 * 1000 } // set expire cookie
})); // config sessions
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    res.locals.login = req.isAuthenticated(); // this will save true or false in login globle variable like $login=true;
    res.locals.session = req.session; // make access inside page as variable name "session" using handlebars
    next();
});

app.use('/user', userRouter); // if router is not /user then ignore
app.use('/', indexRouter); // can't use this as first because if we use other will not work

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
