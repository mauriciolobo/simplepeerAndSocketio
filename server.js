var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var usersConnected = 0;

io.on('connection', function (socket) {
    usersConnected++;
    socket.on('disconnect', function(){
        usersConnected--;
    });

    socket.on('requestPeer', function () {
        socket.broadcast.emit('peerOfferReqested', socket.id);
    });    
    
    socket.on('peerOffer', (socketId, peerData)=>{
        console.log('Sending to:', socketId);
        socket.to(socketId).emit('peerOffered', peerData, socket.id);
    });

    socket.on('peerAnswer', (socketId, peerData)=>{
        console.log('Peer answered:', socketId);        
        socket.to(socketId).emit('peerAnswered', peerData, socket.id);
    });

    console.log('Users connected', usersConnected);
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});