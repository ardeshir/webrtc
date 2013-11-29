#!/usr/bin/env node
var http = require('http'),
    connect = require('connect'),
    WebSocketServer = require('websocket').server,
    channels = [],
    app = connect().use(connect.static('.'));

var wsServer = new WebSocketServer({
  httpServer:new http.createServer(app).listen(8787)
});

wsServer.on('request', function(req) {
  var thisChannel = req.accept('webrtc', req.origin);
  channels.push(thisChannel);
  thisChannel.on('message', function(msg) {
    channels.forEach(function(channel) {
      if (channel !== thisChannel) {
        console.log(msg.utf8Data)
        channel.sendUTF(msg.utf8Data);
      }
    });
  });
  thisChannel.on('close', function() {
    channels = channels.filter(function(channel) {
   return (channel !== thisChannel)?true:false;
    });
  });
});