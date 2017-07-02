/**
 * Copyright beatr-project 2017
 */

const BARNOWL_SOURCE = { protocol: 'serial', path: 'auto' };
const MIDI_PORT = -1; // Set to -1 to disable MIDI
const OSC_LOCAL_ADDRESS = '127.0.0.1';
const OSC_LOCAL_PORT = 57121;
const OSC_TARGET_ADDRESS = '127.0.0.1';
const OSC_TARGET_PORT = 57122;
const OSC_TARGET_ROUTE = '/ble/acceleration';
const HTTP_PORT = 3000;

module.exports.BARNOWL_SOURCE = BARNOWL_SOURCE;
module.exports.MIDI_PORT = MIDI_PORT;
module.exports.OSC_LOCAL_ADDRESS = OSC_LOCAL_ADDRESS;
module.exports.OSC_LOCAL_PORT = OSC_LOCAL_PORT;
module.exports.OSC_TARGET_ADDRESS = OSC_TARGET_ADDRESS;
module.exports.OSC_TARGET_PORT = OSC_TARGET_PORT;
module.exports.OSC_TARGET_ROUTE = OSC_TARGET_ROUTE;
module.exports.HTTP_PORT = HTTP_PORT;
