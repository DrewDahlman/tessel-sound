/*

Copyright (c) 2017. All Rights Reserved.

*/
var tessel = require('tessel');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var url = require('url');
var path = require('path');

var WebServer = require('http').createServer(function (request, response) {

	    // Break up the url into easier-to-use parts
	    var urlParts = url.parse(request.url, true);
	    var ledRegex = /js|styles/;

	    if (urlParts.pathname.match(ledRegex)) {
	      assets(urlParts.pathname, request, response);
	    } else {
	      showIndex(urlParts.pathname, request, response);
	    }
		});

function server(){};

// Extend with EventEmitter
util.inherits(server, EventEmitter);

server.prototype.init = function(){
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
server.prototype.startServer = function(){
	console.log("Server Start...");
	var self = this;

	WebServer.listen(80);
}

/*
------------------------------------------
| showIndex:void (-)
------------------------------------------ */
function showIndex( url, request, response ){
  // Create a response header telling the browser to expect html
  response.writeHead(200, {"Content-Type": "text/html"});

  // Use fs to read in index.html
  fs.readFile(path.dirname(__dirname) + '/www/single.html', function (err, content) {
    // If there was an error, throw to stop code execution
    if (err) {
      throw err;
    }

    // Serve the content of index.html read in by fs.readFile
    response.end(content);
  });
}

/*
------------------------------------------
| assets:void (-)
------------------------------------------ */
function assets( url, request, response ){
	// console.log(request)
	fs.readFile(path.dirname(__dirname) + '/www/' + url, function (err, content) {
    // If there was an error, throw to stop code execution
    if (err) {
      throw err;
    }

    // Serve the content of index.html read in by fs.readFile
    response.end(content);
  });
}


// Export
module.exports = server;