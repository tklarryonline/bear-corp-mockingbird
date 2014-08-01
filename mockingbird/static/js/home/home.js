define([
    'angular',
    'recorder',
    'FileSaver',
    'lodash',
    'angular-ui-router',
    'angular-file-upload'
], function(angular, Recorder) {
    angular.module('homeModule', ['ui.router', 'angularFileUpload']).config(['$stateProvider',
        function($stateProvider) {
            /*config path for home page*/
            $stateProvider.state('home', {
                url: '/',
                templateUrl: '/static/js/home/home.tpl.html',
                controller: 'HomeController'
            });
        }
    ]).controller('HomeController', [
        '$scope',
        '$upload',
        '$location',
        function($scope, $upload, $location) {
            /* initialize */
            $scope.leaderBoards = _(_.range(20)).map(function(value) {
                var record = {};
                record.accuracy = Math.round(Math.random(100) * value);
                record.mood = "Excited";
                record.userVote = value;
                return record;
            }).sortBy(function(record) {
                return -record.accuracy;
            }).value();
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

            var mediaStream, localRecorder;

            $scope.recordStartEventHandler = function() {
                var navigator = window.navigator;
                recognition.start();
                navigator.getUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia
                );

                if (navigator.getUserMedia) {
                    navigator.getUserMedia(
                        { audio: true },
                        // successCallback
                        function(localMediaStream) {
                            mediaStream           = localMediaStream;
                            var context           = new webkitAudioContext();
                            var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
                            var rec               = new window.Recorder(mediaStreamSource);
                            rec.record();
                            localRecorder = rec;
                            mediaStream = localMediaStream;
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
                mediaStream.stop();
                localRecorder.stop();
                localRecorder.exportWAV(function(e) {
                    localRecorder.clear();
                    console.log(e);
                    saveAs(e, "file.wav");
                    // window.Recorder.forceDownload(e);
                });
                recognition.stop();
            };

            $scope.uploadEventHandler = function($files) {
                var submitFile = _.first($files);
                console.log(submitFile);

                $upload.upload({
                    url: "/api/v1/upload",
                    method: "POST",
                    data: {
                        transcript: "Hello world"
                    },
                    file: submitFile
                }).success(function(data, status, headers, config) {
                    console.log(data, status);
                });
            };
        }
    ]);
});
