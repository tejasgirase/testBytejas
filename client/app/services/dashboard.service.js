(function () {
    'use strict';
    angular.module('app')
    .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];

    function dashboardService($http) {
        var service = {
            getMsg: getMsg
        };
        return service;

        function getMsg()
        {
            return $http.get("http://localhost:3000/api/dashboard/getMessage");
        }
    }
})();
