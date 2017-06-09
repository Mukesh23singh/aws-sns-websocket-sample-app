var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
app.use(express.static('public'));
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/', function(req, res, next){

});

app.post('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

function sendNotification(req){
  ws.send(req.msg);
}

app.listen(3000);
