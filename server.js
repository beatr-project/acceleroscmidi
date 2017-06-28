/**
 * Copyright beatr-project 2017
 */

const barnowl = require('barnowl');
const midi = require('midi');
const osc = require('osc');
const config = require('./config');

const STATUS_CONTROL_CHANGE = 0xb0;
const CONTROL_NUMBER = 0x01;  // Modulation

var middleware = new barnowl();
var midiOut = new midi.output();

// MIDI initialisation
listMidiPorts();
midiOut.openPort(config.MIDI_PORT);

// OSC initialisation
udpPort = new osc.UDPPort( { localAddress: config.OSC_LOCAL_ADDRESS,
                             localPort: config.OSC_LOCAL_PORT } );
udpPort.open();

// Bluetooth initialisation
middleware.bind( { protocol: 'serial', path: 'auto' } );
middleware.on('visibilityEvent', function(tiraid) {
  var hasData = (tiraid.identifier.hasOwnProperty('advData') &&
                 tiraid.identifier.advData.hasOwnProperty('serviceData'));

  if(hasData) {
    var serviceData = tiraid.identifier.advData.serviceData;
    var isAccelerometer = (serviceData.hasOwnProperty('minew') &&
                           (serviceData.minew.productModel === 3));

    if(isAccelerometer) {
      var id = tiraid.identifier.value;
      var accelerationX = serviceData.minew.accelerationX;
      var accelerationY = serviceData.minew.accelerationY;
      var accelerationZ = serviceData.minew.accelerationZ;

      outputMidiMessage(id, accelerationX, accelerationY, accelerationZ);
      outputOscMessage(id, accelerationX, accelerationY, accelerationZ);
    }
  }
});


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
function outputMidiMessage(id, accelerationX, accelerationY, accelerationZ) {
  var status = STATUS_CONTROL_CHANGE; // + channel
  var data1 = CONTROL_NUMBER;         // Number
  var data2 = ((Math.round(accelerationX * 32) + 64) % 127);  // Value
  midiOut.sendMessage( [ status, data1, data2 ] );
}


/**
 * Output an OSC message for the given accelerometer data.
 */
function outputOscMessage(id, accelerationX, accelerationY, accelerationZ) {
  var args = [ id, accelerationX, accelerationY, accelerationZ ];
  var message = { address: OSC_TARGET_ROUTE, args: args };
  udpPort.send(message, config.OSC_TARGET_ADDRESS, config.OSC_TARGET_PORT);
}
