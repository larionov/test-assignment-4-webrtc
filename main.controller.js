'use strict';

angular.module('webrtcTest')
	.controller('MainCtrl', function ($scope) {
        var mediaConstraints = { audio: true };


		var data = {recordRTC: null, stream: null},
			audio = angular.element(document.querySelector('#audio'));

		$scope.start = function () {
            navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
		};

		$scope.stop = function () {
            mediaRecorder.stop();
		};
        var audiosContainer = document.getElementById('audios-container');

        var mediaRecorder;
        var index = 1;

        var onMediaSuccess = function(stream) {
            var audio = angular.element(document.querySelector('#audio'));

            // audio = mergeProps(audio, {
            //     controls: true,
            //     src: URL.createObjectURL(stream)
            // });
            // audio.play();

            // audiosContainer.appendChild(audio);
            audiosContainer.appendChild(document.createElement('hr'));

            mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/ogg';
            mediaRecorder.ondataavailable = function(blob) {
                var a = document.createElement('a');
                a.target = '_blank';
                a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);

                a.href = URL.createObjectURL(blob);

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
	});
