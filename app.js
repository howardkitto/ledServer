var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lightControl;
var lightSecondsCount = 0;

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


var lightCounter = function(){
    io.emit('message', "Turn LED On");
    }


io.on('connection', function (socket) {

    socket.on('Light Control', function (msg) {
        switch (msg.lightStatus){
            case "On":
                lightControl = setInterval(lightCounter, 5000);
                break;
            case "Off":
                lightSecondsCount = 0;
                console.log(msg);
                io.emit('message', "Turn LED Off");
                clearInterval(lightControl);
                break;
        }




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
