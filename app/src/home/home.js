define(['angular', 'lodash', 'angular-ui-router', 'angular-file-upload'], function(angular) {
    angular.module('homeModule', ['ui.router', 'angularFileUpload']).config(['$stateProvider',
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
            };

            $scope.recordStopEventHandler = function() {
                recognition.stop();
            };

            $scope.uploadEventHandler = function($files) {
                var submitFile = _.first($files);
                console.log(submitFile);
            };
        }
    ]);
});
