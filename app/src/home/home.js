define(['angular', 'recorder', 'lodash', 'angular-ui-router', 'saver'], function(angular, Recorder, _) {
    angular.module('homeModule', ['ui.router']).config(['$stateProvider',
        function($stateProvider) {
            /*config path for home page*/
            $stateProvider.state('home', {
                url: '/',
                templateUrl: 'src/home/home.tpl.html',
                controller: 'HomeController'
            });
        }
    ]).controller('HomeController', [
        '$scope',
        '$location',
        function($scope, $location) {
            /* initialize */
            $scope.leaderBoards = _(_.range(20)).map(function(value) {
                var record = {};
                record.accuracy = Math.round(Math.random(100) * value);
                record.mood     = "Excited";
                record.userVote = value;
                return record;
            }).sortBy(function(record) { return -record.accuracy; }).value();
            $scope.pageTitle = 'dummy';

            /*recognition webkit*/
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "en-GB";
            recognition.continuous = true;
            recognition.interimResults = true;

            /*on result return*/
            recognition.onresult = function(event) {
                console.log(event.results[0][0].transcript);
            };

            $scope.recordStartEventHandler = function() {
                recognition.start();

              navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

              if (navigator.getUserMedia) {
                navigator.getUserMedia (

                  // constraints
                  {
                    audio: true
                  },

                  // successCallback
                  function(localMediaStream) {
                    var video = document.querySelector('video');
                    video.src = window.URL.createObjectURL(localMediaStream);
                    // video.play();
                    window.a = localMediaStream;
                    // Do something with the video here, e.g. video.play()

                    var context = new webkitAudioContext();
                    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);                    
                    var rec = new window.Recorder(mediaStreamSource);
                    rec.record();
                    console.log(rec);
                    window.rec = rec;
                    window.a = localMediaStream;
                  },

                  // errorCallback
                  function(err) {
                    console.log("The following error occured: " + err);
                  }
                );
              } else {
                console.log("getUserMedia not supported");
              }
            };

            $scope.recordStopEventHandler = function() {
              window.a.stop();
              window.rec.stop();
              window.rec.exportWAV(function(e) {
                window.rec.clear();
                console.log(e);
                saveAs(e, "aaa.wav");
                // window.Recorder.forceDownload(e);
              });
                recognition.stop();
            };

            $scope.uploadEventHandler = function() {
                console.log("upload");
            };
        }
    ]);
});
