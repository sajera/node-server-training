// restart server with nodemon

// main starting point
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var app = express();

// Controllers
var Auth = require('./controllers/authentication.controller.js');

// API setup Router (can be imported from another file)
// setup helpers 
app.use(function ( request, response, next ) {  // prepare common headers
    // Website you wish to allow to connect
    response.setHeader('Access-Control-Allow-Origin', '*'/* 'http://localhost:8888' */);
    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);    
    // Pass to next layer of middleware
    next();
}); 
app.use( morgan('combined') );                  // logger
app.use( bodyParser.json({type: '*/*'}) );      // json parser each request
app.use('/private', Auth.getUserByToken);       // part of url wich close all subs for authorization

// setup Authentification 
app.post('/signup', Auth.signup);
app.post('/signin', Auth.getUserByCredential, Auth.signin);

// setup ptivat

// tests
app.get('/private/data', function ( request, response, next ) {
    // 
    process.env.DEBUG&&
    console.log('Request: "/private/data"');
    
    response.send({
        user: request.user,
    });
});

// setup public

// tests
app.get('/', function ( request, response, next ) {
    // 
    process.env.DEBUG&&
    console.log('Request: "/"');
    
    response.send({public: 'data'});
});


// DB setup
var db = mongoose.connect('mongodb://localhost:27018/auth', { useMongoClient: true }, function () {
    //
    process.env.DEBUG&&
    console.log('MongoDB run mongodb://localhost:27018/auth');
});

// Server setup
var server = http.createServer(app).listen(process.env.PORT || 3000);
//
process.env.DEBUG&&
console.log('Server RUN at "localhost" port =>', process.env.PORT || 3000);
