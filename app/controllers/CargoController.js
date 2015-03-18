/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('CargoController', ['$scope', '$log', '$location'
	, 'CargosResource'
	, function($scope, $log, $location
		, CargosResource) {
	/* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.cargo = {
    	nombre: '',
    	descripcion: ''
    };

    /* ----------------------------------------------------------
     * Observer
     * ---------------------------------------------------------- */
    $scope.cargoObs = {
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
    $scope.newCargo = function (isValid) {
    	if(isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.cargoObs.uploader.isLoading = true;

    		CargosResource.create($scope.cargo, function (response) {
    			$scope.cargoObs.uploader.isSuccess = true;
                $scope.cargoObs.uploader.message = response.message;
    		}, function (error) {
    			if(error.data.message) {
                    $scope.cargoObs.uploader.message = error.data.message;
                } else {
                    $scope.cargoObs.uploader.message = 'Error en el proceso de registro!';
                }
               
                $scope.cargoObs.uploader.isError = true;
    		});
    	}
    };
}]);