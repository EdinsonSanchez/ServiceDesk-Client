/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('TipificacionDetailController', ['$scope', '$log', '$location', '$routeParams', '$stateParams'
    , 'ImpactosResource'
    , 'CategoriasResource'
    , 'TipificacionResource'
    , 'ITipificacionFactory'
    , 'AuthService'
    , 'DTOptionsBuilder'
    , 'DTColumnDefBuilder'
    , function ($scope, $log, $location, $routeParams, $stateParams
        , ImpactosResource
        , CategoriasResource
        , TipificacionResource
        , ITipificacionFactory
        , AuthService
        , DTOptionsBuilder
        , DTColumnDefBuilder) {
                                     
    /* -----------------------------------------------------------------
     * Asignacion de la informacion de la tipificacion actual
     * ----------------------------------------------------------------- */
    TipificacionResource.show({ id: $stateParams.id }, function (currentTipificicacion) {
        $scope.tipificacion = currentTipificicacion;
        $scope.tipificacion.updated = AuthService.getUser();
        
        // Control para el envio al servidor
        $scope.tipificacion.uploader = {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
        
        // Inicializa la interfaz de paso de datos entre controladores
        ITipificacionFactory.tipificaciones = $scope.tipificacion.parents;
        
    }, function (error) {
        $location.url('/404');
    });

    /* ------------------------------------------------
     * Informacion utilizada
     * ------------------------------------------------ */
    $scope.impactos = [];
    $scope.categorias = [];
    
    /* ------------------------------------------------
     * Entidad
     * ------------------------------------------------ */
    $scope.tipificacion = {
        impacto: {},
        categoria: {},
        parents: [],
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
	});
                                              
    CategoriasResource.query({}, function (categorias) {
		$scope.categorias = categorias;
	});
    

    /* ----------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------- */
    // Retira un item de la lista de parents.
    $scope.removeItem = function (index) {
        $scope.tipificacion.parents.splice(index, 1);
    }
    
    // Envia la nueva informacion al servidor.
    $scope.updateTipificacion = function (isValid) {
//        $log.info($scope.tipificacion);
        if(isValid) {
            
            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.tipificacion.uploader.isLoading = true;
            
            TipificacionResource.update($scope.tipificacion, function (response) {
                
                $scope.tipificacion.uploader.isSuccess = true;
                $scope.tipificacion.uploader.message = response.message;

//                 $location.url('/tipificaciones');
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
    }
}]);