/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('AreaDetailController', ['$scope', '$log', '$location', '$stateParams'
	, 'AreasResource'
	, 'AreaResource'
	, function($scope, $log, $location, $stateParams
		, AreasResource
		, AreaResource) {
	
	/* ----------------------------------------------------------
     * Recursos
     * ---------------------------------------------------------- */
    $scope.areas = [];

	/* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.area = {
    	nombre: '',
    	centro_costo: 0.00,
    	parent: {}
    };

    /* ----------------------------------------------------------
     * Observer
     * ---------------------------------------------------------- */
    $scope.areaObs = {
    	uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

    AreasResource.query({}, function (areas) {
		$scope.areas = areas;
		$scope.areas.push({id: '-1', nombre: 'Ninguna'});
	});

    /* ----------------------------------------------------------
     * Asignacion del recurso actual.
     * ---------------------------------------------------------- */
	AreaResource.show({ id: $stateParams.id }, function (currentArea) {
		$scope.area = currentArea;
		$scope.area.centro_costo = parseFloat(currentArea.centro_costo);

		if(currentArea.parent === null) {
			$scope.area.parent = $scope.areas[$scope.areas.length - 1];	
		}
		
	}, function (error) {
		$location.url('/404');
	});


	/* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.updateArea = function (isValid) {
    	if (isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.areaObs.uploader.isLoading = true;

            AreaResource.update($scope.area, function (response) {
            	$scope.areaObs.uploader.isSuccess = true;
                $scope.areaObs.uploader.message = response.message;
            }, function (error) {
            	if(error.data.message) {
                    $scope.areaObs.uploader.message = error.data.message;
                } else {
                    $scope.areaObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                }
               
                $scope.areaObs.uploader.isError = true;
            });
    	}
    };

}])