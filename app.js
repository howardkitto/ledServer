var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var numClients =0;
var lastButtonClicked = 0;
var buttonStates = [true, false, true, false];

io.on('connection', function (socket) {

    //count the number of clients and broadcast it
    ++numClients;
    console.log('A user connected checking my branch ' + numClients);
    socket.emit('connectedClients ', numClients);

    //The client send an ID the create a room for it
    socket.on('join', function(clientId){
        console.log('clientId: ' + clientId + ' just joined')
        socket.join(clientId)
    //Send hello to the client that just joined
        socket.emit('initClient', 'hello ' + clientId)

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

    //update the number of clients when they disconnect
     socket.on('disconnect', function(){
        --numClients;
         console.log('user disconnected' + numClients);
         socket.emit('connectedClients', 50000);
  });

});
