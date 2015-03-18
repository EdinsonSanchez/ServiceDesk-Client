/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('CargoDetailController', ['$scope', '$log', '$location', '$stateParams'
	, 'CargoResource'
	, 'CargosResource'
	, function ($scope, $log, $location, $stateParams
		, CargoResource
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
     * Asignacion del recurso actual.
     * ---------------------------------------------------------- */
	CargoResource.show({ id: $stateParams.id }, function (currentCargo) {
		$scope.cargo = currentCargo;
	}, function (error) {
		$location.url('/404');
	});

	/* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.updateCargo = function (isValid) {
    	if (isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.cargoObs.uploader.isLoading = true;

            CargoResource.update($scope.cargo, function (response) {
            	$scope.cargoObs.uploader.isSuccess = true;
                $scope.cargoObs.uploader.message = response.message;
            }, function (error) {
            	if(error.data.message) {
                    $scope.cargoObs.uploader.message = error.data.message;
                } else {
                    $scope.cargoObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                }
               
                $scope.cargoObs.uploader.isError = true;
            });
    	}
    };
}]);