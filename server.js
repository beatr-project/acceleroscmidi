/**
 * Copyright beatr-project 2017
 */

const barnowl = require('barnowl');
const midi = require('midi');
const osc = require('osc');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const config = require('./config');

const STATUS_CONTROL_CHANGE = 0xb0;
const CONTROL_NUMBER = 0x01;  // Modulation

const app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var middleware = new barnowl();
var midiOut = new midi.output();

// MIDI initialisation
listMidiPorts();
if(config.MIDI_PORT >= 0) {
  midiOut.openPort(config.MIDI_PORT);
}

// OSC initialisation
udpPort = new osc.UDPPort( { localAddress: config.OSC_LOCAL_ADDRESS,
                             localPort: config.OSC_LOCAL_PORT } );
udpPort.open();

// Express web server initialisation
app.use(express.static('web'));
server.listen(config.HTTP_PORT, function () {
  console.log('Browse to localhost:' + config.HTTP_PORT + ' for the web demo');
});

// Socket.io initialisation
io.on('connection', function(client) {
  console.log('socket.io client connected');
  client.on('disconnect', function() {
    console.log('socket.io client disconnected');
  });
});

// Bluetooth initialisation
middleware.bind(config.BARNOWL_SOURCE);
middleware.on('visibilityEvent', function(tiraid) {
  var hasData = (tiraid.identifier.hasOwnProperty('advData') &&
                 tiraid.identifier.advData.hasOwnProperty('serviceData'));

  if(hasData) {
    var serviceData = tiraid.identifier.advData.serviceData;
    var isAccelerometer = (serviceData.hasOwnProperty('minew') &&
                           (serviceData.minew.productModel === 3));

    if(isAccelerometer) {
      var id = tiraid.identifier.value;
      var data = calculateAcceleration(serviceData.minew.accelerationX,
                                       serviceData.minew.accelerationY,
                                       serviceData.minew.accelerationZ);

      outputMidiMessage(id, data);
      outputOscMessage(id, data);
      outputWebsocketMessage(id, data);
    }
  }
});


/**
 * Print to the console all the available MIDI ports.
 */
function calculateAcceleration(accelerationX, accelerationY, accelerationZ) {
  var data = {};
  data.accX = accelerationX.toFixed(3);
  data.accY = accelerationY.toFixed(3);
  data.accZ = accelerationZ.toFixed(3);
  data.angX = ((Math.acos(accelerationX) * 2 / Math.PI) - 1).toFixed(3);
  data.angY = ((Math.acos(accelerationY) * 2 / Math.PI) - 1).toFixed(3);
  data.angZ = ((Math.acos(accelerationZ) * 2 / Math.PI) - 1).toFixed(3);
  return data;
}


/**
 * Print to the console all the available MIDI ports.
 */
function listMidiPorts() {
  var numberOfPorts = midiOut.getPortCount();
  console.log('-------------------------');
  console.log('Available MIDI ports are:');

  for(var cPort = 0; cPort < numberOfPorts; cPort++) {
    console.log(cPort + ': ' + midiOut.getPortName(cPort));
  }
  console.log('-------------------------');
}


/**
 * Output a MIDI message for the given accelerometer data.
 */
function outputMidiMessage(id, data) {
  var status = STATUS_CONTROL_CHANGE; // + channel
  var data1 = CONTROL_NUMBER;         // Number
  var data2 = ((Math.round(data.accX * 32) + 64) % 127);  // Value
  midiOut.sendMessage( [ status, data1, data2 ] );
}


/**
 * Output an OSC message for the given accelerometer data.
 */
function outputOscMessage(id, data) {
  var args = [ id, data.accX, data.accY, data.accZ ];
  var message = { address: config.OSC_TARGET_ROUTE, args: args };
  udpPort.send(message, config.OSC_TARGET_ADDRESS, config.OSC_TARGET_PORT);
}


/**
 * Output a websocket message for the given accelerometer data.
 */
function outputWebsocketMessage(id, data) {
  data.id = id;
  io.emit('accelerometer', data);
}
