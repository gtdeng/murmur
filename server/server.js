var express = require('express');
var firebase = require('./firebase');
var tokenFactory = require('./firebaseTokenFactory').tokenFactory;
var app = express();
var bodyParser = require('body-parser');
var Cookies = require("cookies");
var serverUrl = '104.131.139.49';
var fs = require('fs');
var cors = require('cors');

app.use(cors());
app.use('/murmur', express.static('../client'));
app.use(bodyParser.json());


app.use(Cookies.express());

app.post('/search', function(request, response){
  firebase.search(request, response);
});

// app.get('/noToken', function(request, response) {
//   fs.readFile('../client/src/invite.html', function(err, data) {
//     if (err) {
//       console.log('error reading invite.html');
//     }
//     response.setHeader('Content-Type', 'text/html');
//     response.send(data);
//   });
// });

// app.post('/noToken', function(request, response) {
//   if (request.cookies.get('token')) {
//     console.log('already have a token');
//     request.method = 'get';
//     // response.redirect('/murmur');
//     response.send({
//       redirect: '/murmur'
//     });
//   } else if (request.body.inviteCode === 'mks22') { // set Token Cookie
//     response.cookies.set('token', tokenFactory(), {
//       maxAge: 2628000000, // expires in 1 month
//       httpOnly: false, // more secure but then can't access from client
//     });
//     request.method = 'get';
//     response.send({
//       redirect: '/murmur'
//     });
//   } else {
//     response.send('Correct Invitation Code Required.');
//   }
// });

app.get('/', function(request, response) {
  if (request.cookies.get('token')) {
    response.redirect('/murmur');
  } else {
    response.cookies.set('token', tokenFactory(), {
      maxAge: 604800000, // expires in 1 week
      httpOnly: false, // more secure but then can't access from client
    });
    response.redirect('/murmur');
  }
});

app.post('/', function(request, response) { //request.body.url = 'newPost'
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });

  var slackObject = {};
  request.on('end', function() {
    data.split('&').forEach(function(keyVal) {
      var keyValArr = keyVal.split('=');
      var key = keyValArr[0];
      var val = keyValArr[1];
      slackObject[key] = val;
    });

    function urlDecode(str) {
      return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }

    if (slackObject.token === 'nZg1PC40VFQvtd4efRvcr14N') {
      request.body.token = tokenFactory();
      request.body.message = urlDecode(slackObject.text);
    }
    console.log('SLAAAAAAAAACK', request.body);
    firebase.insertPost(request, response);
  });
  firebase.insertPost(request, response);
});

app.post('/search', function(request, response){ //request.body.url = ?
  firebase.search(request, response);
})

app.post('/comment', function(request, response){ //request.body.url = 'newPost'
  firebase.comment(request, response);
});

app.post('/vote', function(request, response) { //request.body.url = 'newPost'
  firebase.votePost(request, response);
});

app.post('/voteComment', function(request, response) { //request.body.url = 'newPost'
  firebase.voteComment(request, response);
});

app.post('/favorite', function(request, response) { //request.body.url = 'newPost'
  firebase.toggleFavorite(request, response);
});

app.listen(80, serverUrl);
