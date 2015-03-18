/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('UserController', ['$scope', '$log', '$modal', '$location'
    , 'IPersonaFactory'
    , 'UsersResource'
    , 'UsergroupsResource'
    , function ($scope, $log, $modal, $location
        , IPersonaFactory
        , UsersResource
        , UsergroupsResource) {
    
    /* -------------------------------------------
     * Recursos
     * -------------------------------------------*/
    $scope.usergroups = [];
     
    /* -------------------------------------------
     * Entidad
     * -------------------------------------------*/
    $scope.user = {
        username: {},
        password: {},
        persona: {},
        usergroups: []
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
    
    /* -------------------------------------------------------------
     * Acciones principales
     * ------------------------------------------------------------- */
    $scope.newUser = function (isValid) {
        if(isValid) {
            
            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.userObs.uploader.isLoading = true;

            UsersResource.create($scope.user, function (response) {
                $scope.userObs.uploader.isSuccess = true;
                $scope.userObs.uploader.message = response.message;
                
            }, function (error) {
               if(error.data.message) {
                    $scope.userObs.uploader.message = error.data.message;
                } else {
                    $scope.userObs.uploader.message = 'Error en el proceso de registro!';
                    $log.info(error);
                }
               
                $scope.userObs.uploader.isError = true;
            });
        }
    }
}]);