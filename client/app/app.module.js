(function () {
    'use strict';
    angular.module('app', ['ui.router'])

    //.constant('apiRootURL','http://localhost:4000/api')
    .config(config)
    .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

    // Config Block
    function config($stateProvider, $urlRouterProvider, $httpProvider) {
        //$httpProvider.defaults.withCredentials = true;
        var isTokenExists = ['$http', 'authService', '$q', function ($http, authService, $q) {
            if ($http.defaults.headers.common['Authorization'] != undefined)
                return true;

            var deferred = $q.defer();

            authService.getToken().then(function (response) {
                var token = response.data;
                if (token != null && token != "") {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                    deferred.resolve(true);
                }
                else {
                    deferred.reject('Unauthenticated User');
                }
            },
            function (error) {
                deferred.reject('Unauthenticated User');
            });

            return deferred.promise;
        }];

        // Routes
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'content': { templateUrl: 'login/login.html' }
                }
            })           

            .state('app', {
                // url: '/app',
                abstract: true,
                views: {
                    //'header': { template: '<div>Hi..</div>' }
                    'header': { templateUrl: 'layouts/header.html' },
                    'leftmenu': { templateUrl: "" },
                    'content': { template: "<ui-view name='content' />" },
                    'footer': { templateUrl: 'layouts/footer.html' }
                }
            })

            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'content': { templateUrl: 'dashboard/dashboard.html' }
                },
                resolve: isTokenExists
            })            
    }    


    // Run Block
    function run($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log("error",error);
            if (error && error == 'Unauthenticated User') {
                $state.go('login');
            }
        });
    }
})();