(function () {
    'use strict';
    angular.module('app')
    .factory('authService', authService);

    authService.$inject = ['$http'];

    function authService($http) {
        var service = {
            login: login,
            getToken: getToken,
            logout: logout
        };
        return service;

        function login(loginCredentials)
        {
            return $http.post("http://localhost:3000/api/account/authenticate", loginCredentials);
        }

        function getToken()
        {
            return $http.get("http://localhost:3000/api/account/getToken");
        }

        function logout()
        {
            return $http.get("http://localhost:3000/api/account/logout");
        }
    }
})();
