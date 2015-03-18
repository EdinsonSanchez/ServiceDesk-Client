/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('GrupoDetailController', ['$scope', '$log', '$location', '$stateParams'
	, 'GruposResource'
	, 'GrupoResource'
	, function ($scope, $log, $location, $stateParams
		, GruposResource
		, GrupoResource) {
	/* ----------------------------------------------------------
     * Recursos
     * ---------------------------------------------------------- */
    $scope.niveles = [
    	{id: 1, nombre: 'Nivel 1'},	
    	{id: 2, nombre: 'Nivel 2'},	
    	{id: 3, nombre: 'Nivel 3'},	
    	{id: 4, nombre: 'Nivel 4'},	
    	{id: 5, nombre: 'Nivel 5'}
    ];

    /* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.grupo = {
    	nombre: '',
    	descripcion: '',
    	nivel: []
    };

    /* ----------------------------------------------------------
     * Observer
     * ---------------------------------------------------------- */
    $scope.grupoObs = {
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
	GrupoResource.show({ id: $stateParams.id }, function (currentGrupo) {
		$scope.grupo = currentGrupo;
		$scope.grupo.nivel = $scope.niveles[currentGrupo.nivel - 1];
	}, function (error) {
		$location.url('/404');
	});

	/* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.updateGrupo = function (isValid) {
    	if (isValid) {
    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.grupoObs.uploader.isLoading = true;

            GrupoResource.update($scope.grupo, function (response) {
            	$scope.grupoObs.uploader.isSuccess = true;
                $scope.grupoObs.uploader.message = response.message;
            }, function (error) {
            	if(error.data.message) {
                    $scope.grupoObs.uploader.message = error.data.message;
                } else {
                    $scope.grupoObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                }
               
                $scope.grupoObs.uploader.isError = true;
            });
    	}
    };
}]);