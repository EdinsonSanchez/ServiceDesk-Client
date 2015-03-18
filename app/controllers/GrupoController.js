/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('GrupoController', ['$scope', '$log', '$location'
	, 'GruposResource'
	, function ($scope, $log, $location
		, GruposResource) {
	
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
    	nivel: $scope.niveles[2]
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
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.newGrupo = function (isValid) {
    	if(isValid) {

    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.grupoObs.uploader.isLoading = true;

            GruposResource.create($scope.grupo, function (response) {
            	$scope.grupoObs.uploader.isSuccess = true;
                $scope.grupoObs.uploader.message = response.message;
            }, function (error) {
            	if(error.data.message) {
                    $scope.grupoObs.uploader.message = error.data.message;
                } else {
                    $scope.grupoObs.uploader.message = 'Error en el proceso de registro!';
                }
               
                $scope.grupoObs.uploader.isError = true;
            });
    	}
    };
}]);