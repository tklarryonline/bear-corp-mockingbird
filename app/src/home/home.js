define(['angular', 'angular-ui-router'], function(angular) {
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
            }
            $scope.recordButton = function() {
                recognitionInit = !recognitionInit;
                if (recognitionInit) {
                    recognition.start();
                } else {
                    recognition.stop();
                }
            };
        }
    ]);
});
