/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('TipificacionController',
   ['$scope', '$log', '$location'
    , 'ImpactosResource'
    , 'CategoriasResource'
    , 'TipificacionesResource'
    , 'ITipificacionFactory'
    , 'AuthService'
    , 'DTOptionsBuilder'
    , 'DTColumnDefBuilder'
    , function ($scope, $log, $location
        , ImpactosResource
        , CategoriasResource
        , TipificacionesResource
        , ITipificacionFactory
        , AuthService
        , DTOptionsBuilder
        , DTColumnDefBuilder) {
    
    // Inicializa la interfaz de paso de datos entre controladores
    ITipificacionFactory.tipificaciones = [];
                    
    /* ----------------------------------------------------
     * Informacion utilizada
     * ---------------------------------------------------- */
    $scope.impactos = [];
    $scope.categorias = [];
    
    /* ----------------------------------------------------
     * Entidad
     * ---------------------------------------------------- */
    $scope.tipificacion = {
        impacto: {},
        categoria: {},
        parents: [],
        created: AuthService.getUser(),
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };
    
    /* ----------------------------------------------------
     * dtOptions - datatable
     * ---------------------------------------------------- */
    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withPaginationType('full_numbers');

    
    /* ------------------------------------------------------
     * Handlers
     * ------------------------------------------------------ */
    $scope.$on('handlerPushTipificacion', function() {
	    $scope.tipificacion.parents = ITipificacionFactory.tipificaciones;
	});
    
    /* ----------------------------------------------------
     * Recursos necesarios del servidor
     * ---------------------------------------------------- */
    ImpactosResource.query({}, function (impactos) {
		$scope.impactos = impactos;
		$scope.tipificacion.impacto = $scope.impactos[2]; // bajo 
	});
                                              
    CategoriasResource.query({}, function (categorias) {
		$scope.categorias = categorias;
		$scope.tipificacion.categoria = $scope.categorias[0]; // subnivel 
	});
                                              
    /* ----------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------- */
    $scope.removeItem = function (index) {
        $scope.tipificacion.parents.splice(index, 1);
    }
    
    $scope.newTipificacion = function (isValid) {
        if(isValid) {
            
            if($scope.tipificacion.parents.length > 0) {
                
                // Bloque el boton hasta recibir respuesta del servidor.
                $scope.tipificacion.uploader.isLoading = true;
                
                TipificacionesResource.create($scope.tipificacion, function (response) {
                    $scope.tipificacion.uploader.isSuccess = true;
                    $scope.tipificacion.uploader.message = response.message;
//                    $location.url('/tipificaciones');
                }, function (error) {
                    if(error.data.message) {
                        $scope.tipificacion.uploader.message = error.data.message;
                    } else {
                        $scope.tipificacion.uploader.message = 'Error en el proceso de registro!';
                        
                        $log.info(error);
                    }
                    
                    $scope.tipificacion.uploader.isError = true;
                });
            }
            else {
                alert('Elige al menos una referencia superior');
            }
        }
    } 
}]);