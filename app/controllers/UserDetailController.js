/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('UserDetailController', ['$scope', '$log', '$routeParams', '$location', '$stateParams'
	, 'UserResource'
	, 'IPersonaFactory'
    , 'UsergroupsResource'
	, function($scope, $log, $routeParams, $location, $stateParams
		, UserResource
		, IPersonaFactory
        , UsergroupsResource) {
     /* -------------------------------------------
     * Recursos
     * -------------------------------------------*/
    $scope.usergroups = [];

	/* -----------------------------------------------------------------
     * Entidad
     * ----------------------------------------------------------------- */
    $scope.user = {
        username: {},
        password: {},
        persona: {},
        usergroups: [],
        updatePassword: false,
    };

    // Control de envio y recepcion de respuesta del servidor.
    $scope.userObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

    /* ------------------------------------------------------
     * Handlers
     * ------------------------------------------------------ */
    $scope.$on('handlerSelectedPersona', function() {
	    $scope.user.persona = IPersonaFactory.persona;
	});

    /* ------------------------------------------------------
     * Recursos
     * ------------------------------------------------------ */
    UsergroupsResource.query({}, function (usergroups) {
        $scope.usergroups = usergroups;
    });

	 /* -----------------------------------------------------------------
     * Asignacion de la informacion del usuario actual
     * ----------------------------------------------------------------- */
    UserResource.show({ id: $stateParams.id }, function (currentUser) {
        $scope.user = currentUser;

        /* ------------------------------------------------------
         * forma el objeto en un arreglo de ids. 
         * example: {id: 1, title: "public", id:2, title:Author} 
         * Result: [1, 2]
         * Permite enlazar los permisos y visualizar los permisos actuales.
         * ------------------------------------------------------ */
        var roles = [];
        angular.forEach($scope.user.usergroups, function(userrole) {
            roles.push(userrole.id);
        });

        $scope.user.usergroups = roles;
        $scope.user.updatePassword = false;

    }, function (error) {
        $location.url('/404');
    });

    /* -------------------------------------------------------------
     * Acciones principales
     * ------------------------------------------------------------- */
    $scope.updateUser = function (isValid) {
        if(isValid) {
            
            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.userObs.uploader.isLoading = true;

            UserResource.update($scope.user, function (response) {
                
                $scope.userObs.uploader.isSuccess = true;
                $scope.userObs.uploader.message = response.message;

            }, function (error) {
                if(error.data.message) {
                    $scope.userObs.uploader.message = error.data.message;
                } else {
                    $scope.userObs.uploader.message = 'Ocurrio un problema al actualizar la información';
                        
                    $log.info(error);
                }
                
                $scope.userObs.uploader.isError = true;
            });
            
        }
    }

}]);