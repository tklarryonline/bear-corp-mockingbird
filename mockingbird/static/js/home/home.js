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
                elems.find('audio').attr('src', '/' + scope.sp);
                var trans = elems.find('.transcript');
                trans.click(function() {
                    console.log('get here');
                    var transcript = $(this).text();

                    var speech;
                    speech = new SpeechSynthesisUtterance();
                    speech.text = transcript;
                    speech.lang = "en-US";
                    speech.rate = 1.2;
                    speech.onend = function(event) {
                        console.log("Finished in " + event.elapsedTime + " seconds.");
                    };
                    return speechSynthesis.speak(speech, {
                        chunkLength: 120
                    });
                });
                if (scope.index == scope.length-1) {
                    audiojs.events.ready(function() {
                        var as = audiojs.createAll();
                    });


                }

            }
            /*if (scope.$last){
              audiojs.events.ready(function() {
              var as = audiojs.createAll();
              });
              }*/
        }
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

    var sampleScript = "Welcome to Fight Club.\nThe first rule of Fight Club is: you do not talk about Fight Club.\nThe second rule of Fight Club is: you DO NOT talk about Fight Club!";
    var sampleScriptWords = _.countBy(sampleScript.replace(/\n/g, " ").replace(/[.!?:,]/g, "").toLowerCase().split(" "), function(word) {
        return word;
    });

    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
            
    /* initialize */
    /*$scope.leaderBoards = _(_.range(20)).map(function(value) {
        var record = {};
        record.accuracy = Math.round(Math.random(100) * value);
        record.mood = "Excited";
        record.userVote = value;
        return record;
    }).sortBy(function(record) {
        return -record.accuracy;
    }).value();*/

    /*$scope.speeches = Restangular.all("/speeches").getList().then(function(response) {
      console.log(response);
      });*/

    var initialAudioBufer;
    var initialPeaks;
    var tempAudioBufer;
    // Create the filter
    var filter = context.createBiquadFilter();

    var loadSpeechAudio = function(url, audioBuffer) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                var source = context.createBufferSource();
                source.buffer = buffer;

                // Create the audio graph.
                source.connect(filter);
                filter.connect(context.destination);
                // Create and specify parameters for the low-pass filter.
                filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
                filter.frequency.value = 2000; // Set cutoff to 440 HZ

                initialPeaks = getPeaksAtThreshold(buffer, 2000);
                console.log(initialPeaks);

            }, function() {});
        }
        request.send();
    }

    var groupNeighborsByTempo = function(intervalCounts) {
      var tempoCounts = []
      intervalCounts.forEach(function(intervalCount, i) {
        // Convert an interval to tempo
        var theoreticalTempo = 60 / (intervalCount.interval / 44100 );

        // Adjust the tempo to fit within the 90-180 BPM range
        while (theoreticalTempo < 90) theoreticalTempo *= 2;
        while (theoreticalTempo > 180) theoreticalTempo /= 2;

        var foundTempo = tempoCounts.some(function(tempoCount) {
          if (tempoCount.tempo === theoreticalTempo)
            return tempoCount.count += intervalCount.count;
        });
        if (!foundTempo) {
          tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
          });
        }
      });
    }

    var countIntervalsBetweenNearbyPeaks = function(peaks) {
      var intervalCounts = [];
      peaks.forEach(function(peak, index) {
        for(var i = 0; i < 10; i++) {
          var interval = peaks[index + i] - peak;
          var foundInterval = intervalCounts.some(function(intervalCount) {
            if (intervalCount.interval === interval)
              return intervalCount.count++;
          });
          if (!foundInterval) {
            intervalCounts.push({
              interval: interval,
              count: 1
            });
          }
        }
      });
      return intervalCounts;
    }

    var getPeaksAtThreshold = function(data, threshold) {
      var peaksArray = [];
      var length = data.length;
      for(var i = 0; i < length;) {
        if (data[i] > threshold) {
          peaksArray.push(i);
          // Skip forward ~ 1/4s to get past this peak.
          i += 10000;
        }
        i++;
      }
      return peaksArray;
    }

    loadSpeechAudio('/upload/sample.mp3', initialAudioBufer);
    console.log()

    var updatePage = function() {
        Restangular.oneUrl('speeches', '/speeches').get().then(function(response) {
            $scope.speeches = response;
            $scope.leaderBoards = _(response.results).map(function(result) {
                var record = {}
                record.accuracy = result.accuracy;
                Restangular.one('users', result.owner).get().then(function(response) {
                    record.owner = response.username;
                });
                if (record.accuracy < 0.3) {
                    record.progressBarType = "danger";
                } else if (record.accuracy < 0.6) {
                    record.progressBarType = "warning";
                } else {
                    record.progressBarType = "success";
                }
                return record;
            }).sortBy(function(record) {
                return -record.accuracy;
            }).value();
            $scope.speeches.results = _.map(response.results, function(speech) {

                // Calculate tempo/pacing
                
                

                // Calculate accuracy
                var subTotal, totalWords, wordsList;
                wordsList = _.countBy(speech.transcription.replace(/\n/g, " ").replace(/[.!?:,]/g, "").toLowerCase().split(" "), function(word) {
                    return word;
                });
                console.log(wordsList);
                totalWords = _.reduce(_.pluck(wordsList), function(prev, next) {
                    return prev + next;
                }, 0);
                subTotal = 0;
                _.each(wordsList, function(value, key) {
                    if (_.has(sampleScriptWords, key)) {
                        return subTotal += value;
                    }
                });
                speech.accuracy = subTotal * 1.0 / totalWords;
                if (speech.accuracy < 0.3) {
                    speech.progressBarType = "danger";
                } else if (speech.accuracy < 0.6) {
                    speech.progressBarType = "warning";
                } else {
                    speech.progressBarType = "success";
                }
                return speech;
            });

        });
    }
    updatePage();

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
                updatePage();
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

            $scope.bindFileUploadClick = function() {
                var $fileUploader = $("#fileupload #uploader");
                var $uploadConfirmModal = $("#upload-confirm-modal");
                $fileUploader.click();
                $fileUploader.change(function() {
                    var filename = $fileUploader[0].files[0].name;
                    $("#fileupload #title").val(filename);
                    $uploadConfirmModal.find("span.label-file-name").html(filename);
                    $uploadConfirmModal.modal();
                });
            };

            $scope.submitFileUploadForm = function() {
                $("#fileupload").submit();
            };

            $scope.readTranscript = function(transcript) {
                console.log(transcript);
                var speech;
                speech = new SpeechSynthesisUtterance();
                speech.text = transcript;
                speech.lang = "en-US";
                speech.rate = 1.2;
                speech.onend = function(event) {
                    console.log("Finished in " + event.elapsedTime + " seconds.");
                };
                return speechSynthesis.speak(speech, {
                    chunkLength: 120
                });
            };

        }
    ]);
});
