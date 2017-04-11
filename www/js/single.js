var socket = io('http://soundserver.local:8080');
socket.on('connect', function(){
	console.log("connected!")
});

var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false; 

var notes = {
	1: 'C4',
	2: 'D4',
	3: 'E4',
	4: 'F4',
	5: 'G4',
	6: 'A5',
	7: 'B5',
	8: 'C5',
	9: 'D5',
	10: 'E5',
	11: 'F5',
	12: 'G5',
	13: 'A6'
}
var oldNote;

var instrument;


Soundfont.instrument(new AudioContext(), '/js/libs/xylophone-mp3.js').then( function(xylophone){
	instrument = xylophone;
	listen();
});

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function listen(){
	socket.on('a', function(data){

		var note = Math.round( data / 13 );

		if( oldNote != note ){
			instrument.play(notes[note]);
			oldNote = note;
		}

		var _color = intToRGB(hashCode(note+"nice"))

		$('body').css('background-color', '#' + _color)

	});

	socket.on('disconnect', function(){
		console.log("BYE BYE")
	});
}