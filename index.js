// restart server with nodemon

// npm dependencies
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors');

// local dependencies
var app = express();
var Auth = require('./controllers/authentication.controller.js');

// configuration
var corsOptions = {
    origin: '*',
    // var whitelist = ['http://example1.com', 'http://example2.com']
    // origin: function ( origin, callback ) { // example of dinamic origin
    //     if (whitelist.indexOf(origin) !== -1) {
    //         callback(null, true)
    //     } else {
    //         callback(new Error('Not allowed by CORS'))
    //     }
    // }
};

// API setup Router (can be imported from another file)
// setup helpers 
app.use( cors( corsOptions ) );

// !!!! full control
// app.use(function ( request, response, next ) {  // prepare common headers
//     // Website you wish to allow to connect
//     response.setHeader('Access-Control-Allow-Origin', '*'/* 'http://localhost:8888' */);
//     // Request methods you wish to allow
//     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     response.setHeader('Access-Control-Allow-Credentials', true);    
//     // Pass to next layer of middleware
//     next();
// }); 
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

var port = process.env.PORT || 3000;
// Server setup
var server = http.createServer(app).listen(port, function () {
    //
    process.env.DEBUG&&
    console.log('Server RUN at "localhost" port =>', port);
});
