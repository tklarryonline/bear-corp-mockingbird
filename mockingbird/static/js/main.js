$(document).ready(function() {
    var $html = $('html');
    angular.module('mockingbird', [])
    .config(['$interpolateProvider', function($interpolateProvider) {
         $interpolateProvider.startSymbol('[[');
         $interpolateProvider.endSymbol(']]');
    }]);
    angular.bootstrap($html, ['mockingbird']);
});
