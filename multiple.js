"use strict";

const tessel = require('tessel');
const VL53L0X = require('tessel-vl53l0x');
const FloatBuffer = require('./utils/float-buffer');
var io = require('socket.io-client');
var server = require('./bin/server-multiple');
var sockerServer = require('./bin/socket-server');

const _vl53l0x = new VL53L0X(tessel.port.A);
const _vl53l0x_b = new VL53L0X(tessel.port.B);

function init(){

	// Servers
  let _socketServer = new sockerServer();
  _socketServer.init();

  let _server = new server();
  _server.init();

	// Distance buffer
	let _distanceBuffer = new FloatBuffer( 2 );
  _distanceBuffer.update(1);

  // Listener
	_vl53l0x.on('distance', function(data){

		// If data above 700 ignore noise
		if( data < 190 ){
			_distanceBuffer.update( data );
		} else {
			_distanceBuffer.update( 190 );
		}

		// Get distance from buffer average
		let _dis = Math.round(_distanceBuffer.average());			
		_socketServer.update( 'a', _dis );
	});

 	let _distanceBuffer_b = new FloatBuffer( 2 );
  _distanceBuffer_b.update(1);

	_vl53l0x_b.on('distance', function(data){

		// If data above 700 ignore noise
		if( data < 190 ){
			_distanceBuffer_b.update( data );
		} else {
			_distanceBuffer_b.update( 190 );
		}

		// Get distance from buffer average
		let _dis = Math.round(_distanceBuffer_b.average());			
		_socketServer.update( 'b', _dis );
	});

	// Config & start capture
	_vl53l0x.setSignalRateLimit(.05, () => {
		// _vl53l0x.startCapture();	
		setInterval( function(){
			_vl53l0x.singleCapture();
		},200)		
	});

	_vl53l0x_b.setSignalRateLimit(.05, () => {
		// _vl53l0x_b.startCapture();	
		setInterval( function(){
			_vl53l0x_b.singleCapture();
		},255)	
	});
}

init();