var express = require('express');
var http = require('http');
var url = require('url');
var WebSocket = require('ws');
var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server});
console.log(JSON.stringify(wss))
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function (req, res, next) {
  console.log('middleware');
  return next();
});

wss.on('connections', function connection(ws, req) {
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  wss = ws;

  wss.send('connected');
  console.log('connected')
});

app.get('/', function(req, res, next){
  return next();
});

app.post('/', function(req, res, next){
  wss.send(req.body.msg);
  res.send("done");
});

app.listen(process.env.PORT || 5000)
