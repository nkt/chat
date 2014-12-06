function ChatController($io) {
    this.messages = [];
    this.contacts = [];
    this.newMessage = '';
    this.io = $io;
    this.io.on('message', this.receive.bind(this));
}

ChatController.prototype.send = function () {
    this.io.emit('message', this.newMessage);
    this.newMessage = '';
};

ChatController.prototype.receive = function (data) {
    this.messages.push(data);
};

var app = angular.module('app', [
    'btford.socket-io'
]);
app.factory('$io', function (socketFactory) {
    return socketFactory();
});
app.controller('ChatController', ChatController);
