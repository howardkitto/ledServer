var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/roomConnect', function (req, res) {
  res.sendfile(__dirname + '/roomConnect.html');
});


var numClients =0;
var lastButtonClicked = 0;
var buttonStates = [true, false, true, false];
var mostRecentConnection = '';

io.on('connection', function (socket) {

    socket.on('room', function(room){
        socket.join(room);
        mostRecentConnection = room
        console.log('preparing to send to ' + mostRecentConnection );
        io.in(room).emit('initialState', buttonStates);
    });

    socket.on('Light Control', function (msg) {
        console.log(msg);
        lastButtonClicked = msg.theButton;
        io.emit('Light Control', msg.lightStatus);
        updateButtons();
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

        io.emit('lightArray', buttonStates);

    });

    updateButtons = function(){

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
        console.log(buttonStates)

        io.emit('arduinoAck', buttonStates);
    }



});
