/*

Copyright (c) 2017. All Rights Reserved.

*/
var tessel = require('tessel');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var WebServer = require('http').createServer(function (request, response) {
		  response.writeHead(200, {"Content-Type": "text/plain"});
		  response.end("Hello from a laser beam!\n");
		});
var io = require('socket.io')(WebServer);

function SocketServer(){};

// Extend with EventEmitter
util.inherits(SocketServer, EventEmitter);

SocketServer.prototype.init = function(){
	var self = this;

	// Log
	console.log("Spinning up server...");

	// Broadcast event
	this.emit('EVENT', 'SERVER_SPINNING_UP');

	// Start Server
	self.startServer()
}

/*
------------------------------------------
| startServer:void (-)
------------------------------------------ */
SocketServer.prototype.startServer = function(){
	console.log("Server Start...");
	var self = this;

	WebServer.listen(8080);
}

/*
------------------------------------------
| update:void (-)
------------------------------------------ */
SocketServer.prototype.update = function( device, data ){
	// console.log("DISTANCE: " + data + "cm");	
	// let _data = data / 2.45;
	io.sockets.emit(device, data);
}

// Export
module.exports = SocketServer;