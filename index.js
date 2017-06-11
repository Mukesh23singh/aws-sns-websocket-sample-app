var WebSocketServer = require("ws").Server;
var http = require('http');
var https = require('https');
var express = require("express");
var app = express();
var MessageValidator = require('sns-validator');
var CircularJSON = require('circular-json');
var validator = new MessageValidator();
var port = process.env.PORT || 5000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next){
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.text += chunk });
    req.on('end', next);
  } else {
    next();
  }
});

app.use(express.static('public'));

var server = http.createServer(app);
server.listen(port);
app.use(function (req, res, next) {
  console.log('middleware');
  return next();
});
console.log("http server listening on %d", port);
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  console.log("websocket connection open")
  wss = ws;
  ws.on("close", function() {
    console.log("websocket connection close")
  })
})

app.get('/', function(req, res, next){
  res.send("done");
});

app.post('/', function(req, res, next){
  snsHandler(req.text);
  res.send("done");
});

function snsHandler(message){
  message = JSON.parse(message);
  console.log(message);
  validator.validate(message, function (err, message) {
    if (err) {
        console.error(err);
        return;
    }

    if (message['Type'] === 'SubscriptionConfirmation') {
        https.get(message['SubscribeURL'], function (res) {
          console.log('SNS Subscription Confirm');
        });
    }

    if (message['Type'] === 'Notification') {
      wss.send(message['Message']);
      console.log(message['MessageId'] + ': ' + message['Message']);
    }
  });
}
