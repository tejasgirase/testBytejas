(function () {
    'use strict';
    angular.module('app')
    .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['authService', '$state', '$http'];

    function HeaderController(authService, $state, $http) {
        var vm = this;
        vm.logout = logout;

        function logout() {
            authService.logout().then(function (response) {
                if (response.status == 200) {
                    delete $http.defaults.headers.common['Authorization'];                    
                    $state.go('login');
                }
            });
        }
    }
})();