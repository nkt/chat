var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

function Chat(io) {
    this.io = io;
    this.messages = [];
    this.io.on('connection', this.handleConnect.bind(this));
}

Chat.prototype.handleMessage = function(text) {
    var message = {
        date: new Date(),
        text: text
    };

    this.io.emit('message', message);
    this.messages.push(message);
};

Chat.prototype.handleConnect = function(conn) {
    console.info('new connect');
    this.messages.forEach(function(message) {
        console.log(message);
        conn.emit('message', message);
    });
    conn.on('disconnect', this.handleDisconnect.bind(this));
    conn.on('message', this.handleMessage.bind(this));
}

Chat.prototype.handleDisconnect = function(conn) {
    console.warn('disconnect');
}

var chat = new Chat(io);

app.use('/', express.static(__dirname + '/public'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

var port = process.env.NODE_PORT || 3333;
server.listen(port, function() {
    console.info('Server started on %s', port);
});
