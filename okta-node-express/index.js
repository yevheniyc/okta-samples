var express = require('express'),
    connect = require('connect'),
    auth = require('./auth');
    logger = require('morgan');
    compress = require('compression');
    cookieParser = require('cookie-parser');
    bodyParser = require('body-parser');
    multer = require('multer');
    session = require('express-session');

var app = express();

app.use(logger());
app.use(compress());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "won't tell because it's secret"  }));
app.use(auth.initialize());
app.use(auth.session());

app.get('/', auth.protected, function (req, res){
	  res.end("Hello " + req.session.passport.user);
});

app.get('/hello', auth.protected, function (req, res){
	  res.end("Hello World!");
});

app.post('/login/callback', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
    res.redirect('/');
  }
);

app.get('/login', auth.authenticate('saml', { failureRedirect: '/', failureFlash: true }), function (req, res) {
    res.redirect('/');
  }
);

var port
port = 80

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port
    console.log('Webserver listening at http://%s:%s', host, port)
})

console.log("Server started");
