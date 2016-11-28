(function () {
    'use strict';
    angular.module('app')
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['dashboardService'];

    function DashboardController(dashboardService) {
        var vm = this;
        vm.displayMessage = "";

        Init();

        function Init(){
            getMessage();            
        }

        function getMessage() {            
            dashboardService.getMsg().then(function (response) {
                vm.displayMessage = response.data;
            });
        }
    }
})();