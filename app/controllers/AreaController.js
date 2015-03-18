/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('AreaController', ['$scope', '$log', '$location'
	, 'AreasResource'
	, function($scope, $log, $location
		, AreasResource) {
	
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

		$scope.area.parent = $scope.areas[$scope.areas.length - 1];
	});

    /* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.newArea = function (isValid) {
    	if(isValid) {
    		$log.info($scope.area);

    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.areaObs.uploader.isLoading = true;

    		AreasResource.create($scope.area, function (response) {
    			$scope.areaObs.uploader.isSuccess = true;
                $scope.areaObs.uploader.message = response.message;
    		}, function (error) {
    			if(error.data.message) {
                    $scope.areaObs.uploader.message = error.data.message;
                } else {
                    $scope.areaObs.uploader.message = 'Error en el proceso de registro!';
                }
               
                $scope.areaObs.uploader.isError = true;
    		});
    	}
    };

}])