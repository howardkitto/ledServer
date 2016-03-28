var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var lastButtonClicked = 0;
var buttonStates = [true, false, true, false];

io.on('connection', function (socket) {

    socket.on('Light Control', function (msg) {
        lastButtonClicked = msg.theButton;
        io.emit('Light Control', msg.lightStatus);
    });

    socket.on('arduinoAck', function (msg) {

          if(lastButtonClicked == 0){
              buttonStates[1] = true;
          }
          else if(lastButtonClicked == 1){
              buttonStates[0] = true;
          }
          else if(lastButtonClicked == 2){
              buttonStates[3] = true;
          }
          else if(lastButtonClicked == 3){
              buttonStates[2] = true;
          }

          buttonStates[lastButtonClicked] = false;

        io.emit('arduinoAck', buttonStates);

    });

});
