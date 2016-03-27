var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var sendMessage = function(msgToArd){
    io.emit('buttonClick', msgToArd);
    console.log(msgToArd);
    };

io.on('connection', function (socket) {

    socket.on('Light Control', function (msg) {
        sendMessage(msg.lightStatus);
    });

    socket.on('arduinoAck', function (msg) {
        io.emit('arduinoAck', msg);
        console.log(msg);
    });

});
