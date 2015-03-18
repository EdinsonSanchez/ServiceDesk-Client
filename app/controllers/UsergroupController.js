/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('UsergroupController', ['$scope', '$log', '$modal', '$location'
	, 'UsergroupsResource'
	, function($scope, $log, $modal, $location
		, UsergroupsResource){
	
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
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.newUsergroup = function (isValid) {
    	if(isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.usergroupObs.uploader.isLoading = true;

    		UsergroupsResource.create($scope.usergroup, function (response) {
    			$scope.usergroupObs.uploader.isSuccess = true;
                $scope.usergroupObs.uploader.message = response.message;
    		}, function (error) {
    			if(error.data.message) {
                    $scope.usergroupObs.uploader.message = error.data.message;
                } else {
                    $scope.usergroupObs.uploader.message = 'Error en el proceso de registro!';
                }
               
                $scope.usergroupObs.uploader.isError = true;
    		});
    	}
    };
    
}]);