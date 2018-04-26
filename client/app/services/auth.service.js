(function () {
    'use strict';
    angular.module('app')
    .factory('authService', authService);

    authService.$inject = ['$http'];
    const host = "http://ec2-52-15-164-178.us-east-2.compute.amazonaws.com:3000";
    // const host = "http://localhost:3000";
    
    function authService($http) {
        var service = {
            login: login,
            getToken: getToken,
            logout: logout
        };
        return service;

        function login(loginCredentials)
        {
            return $http.post(host+"/api/account/authenticate", loginCredentials);
        }

        function getToken()
        {
            return $http.get(host+"/api/account/getToken");
        }

        function logout()
        {
            return $http.get(host+"/api/account/logout");
        }
    }
})();
