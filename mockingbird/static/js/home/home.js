define([
    'angular',
    'recorder',
    'FileSaver',
    'lodash',
    'angular-ui-router',
    'restangular',
    'angular-file-upload',
    'audiojs'
], function(angular, Recorder) {

    angular.module('homeModule', ['ui.router', 'restangular', 'angularFileUpload']).config(['$stateProvider',
        function($stateProvider) {
            /*config path for home page*/
            $stateProvider.state('home', {
                url: '/',
                templateUrl: '/static/js/home/home.tpl.html',
                //templateUrl: '/accounts/profile/home/',
                controller: 'HomeController'
            });
        }
    ]).directive('speechDirective', function() {
        return {
            scope: { sp:'=', index:'=', length:'=' },
            link: function(scope, elems) {
                console.log(scope);
                elems.find('audio').attr('src', '/' + scope.sp);
                if (scope.index == scope.length-1) {
                    audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                    });
                }
                /*if (scope.$last){
                    audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                    });
                }*/
            }
        };
        /*return function(scope, element, attrs) {
            element.find('audio').attr(src, '');
            if (scope.$last){
                audiojs.events.ready(function() {
                    var as = audiojs.createAll();
                });
            }
        };*/
    }).controller('HomeController', [
        '$scope',
        '$upload',
        '$location',
        'Restangular',
        function($scope, $upload, $location, Restangular, $sce) {
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

            /*$scope.speeches = Restangular.all("/speeches").getList().then(function(response) {
                console.log(response);
            });*/
            Restangular.oneUrl('speeches', '/speeches').get().then(function(response) {
                //$scope.speeches = response;
                $scope.speeches = response;
            });

            /*recognition webkit*/
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "en-GB";
            recognition.continuous = true;
            recognition.interimResults = true;

            var transcription;
            /*on result return*/
            recognition.onresult = function(event) {
                transcription = event.results[0][0].transcript;
                console.log(transcription);
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
                    // window.Recorder.forceDownload(e);
                    var fd = new FormData();
                    fd.append('fname', 'test.wav');
                    fd.append('data', e);
                    fd.append('transcription', transcription);
                    $.ajax({
                        type: 'POST',
                        url: '/speeches/submit-silent/',
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done(function(data) {
                        console.log(data);
                        Restangular.oneUrl('speeches', '/speeches').get().then(function(response) {
                            $scope.speeches = response;
                        });

                    });
                });
                recognition.stop();
            };

            $scope.uploadEventHandler = function($files) {
                var submitFile = _.first($files);
                // using jQuery
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                var csrftoken = getCookie('csrftoken');
                function csrfSafeMethod(method) {
                    // these HTTP methods do not require CSRF protection
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                }
            };
        }
    ]);
});
