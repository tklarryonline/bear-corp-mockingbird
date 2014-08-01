define(['angular', 'lodash', 'angular-ui-router'], function(angular) {
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
            $scope.leaderBoards = _.range(20).map(function(value) {
                var record = {};
                record.accuracy = Math.round(Math.random(100) * value);
                record.mood     = "Excited";
                record.userVote = value;
                return record;
            });
            $scope.pageTitle = 'dummy';

            /*recognition webkit*/
            var recognition = new webkitSpeechRecognition();
            var recognitionInit = false;
            recognition.lang = "en-GB";
            recognition.continuous = true;
            recognition.interimResults = true;

            /*on result return*/
            recognition.onresult = function(event) {
                console.log(event.results[0][0].transcript);
            };

            $scope.recordEventHandler = function() {
                recognitionInit = !recognitionInit;
                if (recognitionInit) {
                    recognition.start();
                } else {
                    recognition.stop();
                }
            };

            $scope.uploadEventHandler = function() {
                console.log("upload");
            };
        }
    ]);
});
