(function () {
    'use strict';
    angular.module('app')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['authService', '$state', '$http'];

    function LoginController(authService, $state, $http) {
        var vm = this;
        vm.loginCredentials = {
            "username": "tejas",
            "password": "tejas"
        };
        vm.login = login;
        vm.showErrorMsg = false;

        function login() {
            console.log(vm.loginCredentials);
            authService.login(vm.loginCredentials).then(function (response) {
                window.jwtToken = response.data.token;
                if (window.jwtToken) {
                    // Add JWT token as default auth header
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + window.jwtToken;
                    
                    $state.go('app.dashboard');
                }
                else {
                    vm.showErrorMsg = true;
                }
            });
        }
    }
})();