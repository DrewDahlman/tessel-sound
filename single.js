"use strict";

const tessel = require('tessel');
const VL53L0X = require('tessel-vl53l0x');
const FloatBuffer = require('./utils/float-buffer');
var io = require('socket.io-client');
var server = require('./bin/server');
var sockerServer = require('./bin/socket-server');

const _vl53l0x = new VL53L0X(tessel.port.A);

function init(){

	// Distance buffer
	let _distanceBuffer = new FloatBuffer( 2 );
  _distanceBuffer.update(1);

  // Servers
  let _socketServer = new sockerServer();
  _socketServer.init();

  let _server = new server();
  _server.init();

  var _max = 90;

  // Listener
	_vl53l0x.on('distance', function(data){

		// If data above 700 ignore noise
		if( data < _max ){
			_distanceBuffer.update( data );
		} else {
			_distanceBuffer.update( _max );
		}

		// Get distance from buffer average
		let _dis = Math.round(_distanceBuffer.average());
		_socketServer.update( 'a', _dis );
	});

	// Config & start capture
	_vl53l0x.setSignalRateLimit(.01, () => {
		_vl53l0x.startCapture();		
	});

}

init();