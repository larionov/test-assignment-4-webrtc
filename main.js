'use strict';

var mediaConstraints = { audio: true };


var data = {recordRTC: null, stream: null},
	audio = document.querySelector('#audio');

document.querySelector('#start').onclick = function() {
	this.disabled = true;
	navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
};

document.querySelector('#stop').onclick = function() {
	this.disabled = true;
	mediaRecorder.stop();
};


var audiosContainer = document.getElementById('audios-container');

var mediaRecorder;
var index = 1;

function encode64(buffer) {
    var binary = '',
        bytes = new Uint8Array( buffer ),
        len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

var onMediaSuccess = function(stream) {
	var audio = document.querySelector('#audio');

	// audio = mergeProps(audio, {
	//     controls: true,
	//     src: URL.createObjectURL(stream)
	// });
	// audio.play();

	// audiosContainer.appendChild(audio);
	audiosContainer.appendChild(document.createElement('hr'));

	mediaRecorder = new MediaStreamRecorder(stream);
	mediaRecorder.mimeType = 'audio/ogg';
	mediaRecorder.ondataavailable = function(blob, e) {
		var a = document.createElement('a');
		a.target = '_blank';
		a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);

		var url = 'data:audio/mp3;base64,'+encode64(e.data.buf);
		a.href = url;

		audiosContainer.appendChild(a);
		audiosContainer.appendChild(document.createElement('hr'));
	};

	var timeInterval = 5000;
	if(timeInterval) timeInterval = parseInt(timeInterval);
	else timeInterval = 5 * 1000;

	// get blob after specific time interval
	mediaRecorder.start(timeInterval);
}

var onMediaError = function (e) {
	console.error('media error', e);
}

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Bytes';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
	var data = new Date(milliseconds);
	return data.getUTCHours()+" hours, "+data.getUTCMinutes()+" minutes and "+data.getUTCSeconds()+" second(s)";
}