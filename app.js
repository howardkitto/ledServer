var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var sendMessage = function(msgToArd){
    io.emit('message', msgToArd);
    console.log(msgToArd);
    };

io.on('connection', function (socket) {

    socket.on('Light Control', function (msg) {
        sendMessage(msg.lightStatus);


//        switch (msg.lightStatus){
//            case "On":
//                console.log(msg);
//                sendMessage("On");
//                break;
//            case "Off":
//                console.log(msg);
//                sendMessage("Off");
//                break;
//        }
    });


});












//        setInterval (
//        function() {
//            if (clockStatus == true)
//                {
//                var msg = Math.random();
//                io.emit('message', msg);
//                console.log (msg);
//                }, 1000});
//};
