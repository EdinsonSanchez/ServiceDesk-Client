/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('UsergroupDetailController', ['$scope', '$log', '$location', '$stateParams'
	, 'UsergroupsResource'
	, 'UsergroupResource'
	, function($scope, $log, $location, $stateParams
		, UsergroupsResource
		, UsergroupResource){
	
	/* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.usergroup = {
    	title: '',
    };

    /* ----------------------------------------------------------
     * Observer
     * ---------------------------------------------------------- */
    $scope.usergroupObs = {
    	uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

    /* ----------------------------------------------------------
     * Asignacion del recurso actual.
     * ---------------------------------------------------------- */
	UsergroupResource.show({ id: $stateParams.id }, function (currentRol) {
		$scope.usergroup = currentRol;
	}, function (error) {
		$location.url('/404');
	});

	/* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.updateUsergroup = function (isValid) {
    	if (isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.usergroupObs.uploader.isLoading = true;

            UsergroupResource.update($scope.usergroup, function (response) {
            	$scope.usergroupObs.uploader.isSuccess = true;
                $scope.usergroupObs.uploader.message = response.message;
            }, function (error) {
            	if(error.data.message) {
                    $scope.usergroupObs.uploader.message = error.data.message;
                } else {
                    $scope.usergroupObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                }
               
                $scope.usergroupObs.uploader.isError = true;
            });
    	}
    };

}]);