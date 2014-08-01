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
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "en-GB";
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = function(event) {
                console.log(event.results[0][0].transcript);
            }
            recognition.start();
        }
    ]);
});
