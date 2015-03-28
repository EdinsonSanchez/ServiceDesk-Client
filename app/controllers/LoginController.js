/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('LoginController',
	['$scope', '$rootScope', '$log', '$location', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 
	function ($scope, $rootScope, $log, $location, USER_ROLES, AUTH_EVENTS, AuthService) {

    /* -------------------------------------------------------
     * Entidad
     * ------------------------------------------------------- */
		$scope.user = { username: '', password: '' };
		$scope.message = '';

    var hostapp = $location.protocol() + "://" + $location.host() + ($location.port() != "" ? ':' + $location.port() : '' ) + '/' +appName;

    // $log.info(hostapp);
		/* -------------------------------------------------------
     * Funciones principales
     * ------------------------------------------------------- */
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    }; 
        
		$scope.login = function(isValid) {
            
      if(isValid) {
          
          AuthService.login($scope.user).then(function (userLog) {
              // clear messages
              $scope.message = '';
              // handler
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
              // Usuario actual
              $scope.setCurrentUser(userLog);
              // redirecciona al dashboard
              window.location.href = hostapp + '/#/tickets';

          }, function () {
              $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
              $scope.message = 'El nombre de usuario o la clave proporcionados no son los correctos!';
          });
      }
		};

		$scope.logout = function () {
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			AuthService.logout();

      // redirecciona a la pagina de login
       window.location.href = hostapp + '/login.html';
		};
}]);

app.controller('AuthController', ['$scope', '$log', '$location', 'AuthService', 'USER_ROLES', function ($scope, $log, $location, AuthService, USER_ROLES) {
    
    $scope.currentUser = AuthService.getUser();
    var hostapp = $location.protocol() + "://" + $location.host() + ($location.port() != "" ? ':' + $location.port() : '' ) + '/' +appName;

//    $log.info($scope.currentUser);
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    init();
    
    function init() {
        if(!AuthService.isAuthenticated()) {
            // redirecciona a la pagina de login
            window.location.href = hostapp + '/login.html';
        }
    }
    
}]);