const  createError = require('http-errors');
const  express = require('express');
const  path = require('path');
const  cookieParser = require('cookie-parser');
const  logger = require('morgan');
const db = require('./config/config');
const session = require('express-session')
const passport = require('passport');
db();


//Routing of user
const  userRoutes = require('./modules/user/routes/userRoutes');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 

/*------- session use ------*/
app.use(session({
  secret: 'copypaste',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  
}))
    


//passport module 
app.use(passport.initialize());
app.use(passport.session());


//userRoute
app.use('/', userRoutes);



//google authenticate
app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/homepage',
        failureRedirect: '/'
}));



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
