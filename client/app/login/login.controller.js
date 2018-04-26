(function () {
    'use strict';
    angular.module('app')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['authService', '$state', '$http'];

    function LoginController(authService, $state, $http) {
        var vm = this;
        vm.loginCredentials = {
            "email": "tejasgirasr@gmail.com",
            "password": "tejas"
        };
        vm.login = login;
        vm.forgotPassword = forgotPassword;
        vm.showErrorMsg = false;
        vm.forgetPasswordEmailErr = false;
        vm.showSuccessMsg = false;

        function login() {
            vm.showSuccessMsg = false;
            vm.showErrorMsg = false;
            if(vm.loginCredentials.username){}
            authService.login(vm.loginCredentials).then(function (response) {
                window.jwtToken = response.data.token;
                if (window.jwtToken) {
                    // Add JWT token as default auth header
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + window.jwtToken;
                    
                    $state.go('app.dashboard');
                }
                else {
                    vm.msgErr = response.data;
                    vm.showErrorMsg = true;
                }
            });
        }

        function forgotPassword() {
            vm.forgetPasswordEmailErr = false;
            vm.showErrorMsg = false;
            if(vm.loginCredentials.email && vm.loginCredentials.email != ""){
                vm.forgetPasswordEmailErr = false;
                authService.forgotPassword(vm.loginCredentials).then(function (response) {
                    console.log(response);
                    if (response.data && response.data.data.newPassword) {
                        vm.msg ="new password link in sent to your Email, Now you can login with new password";
                        vm.showSuccessMsg = true;
                    }
                    else {
                        vm.msg ="Error in sent new password to your Email.";
                        vm.showSuccessMsg = false;
                    }
                });
            }else{
                vm.forgetPasswordEmailErr = true;
            }
        }



        
    }
})();