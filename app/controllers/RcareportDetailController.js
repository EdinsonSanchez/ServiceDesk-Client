/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('RcareportDetailController', 
   ['$scope'
    , '$log'
    , '$routeParams'
    , 'RcareportResource'
    , 'EmpresasResource'
    , 'SucursalesResource'
    , 'PersonasFactory'
    , 'ImpactosResource'
    , function ($scope
        , $log
        , $routeParams
        , RcareportResource
        , EmpresasResource
        , SucursalesResource
        , PersonasFactory
        , ImpactosResource) {
                    
    /* -----------------------------------------------
     * Informacion utilizada
     * ----------------------------------------------- */
    $scope.empresas = [];
    $scope.sucursales = [];
    $scope.personas = [];
    $scope.urgencias = [];
    $scope.impactos = [];
    $scope.prioridades = [
        { id: 1, nombre: 'Critica' },
        { id: 2, nombre: 'Alta' },
        { id: 3, nombre: 'Media' },
        { id: 4, nombre: 'Baja' }
    ];

    /* ------------------------------------------------
     * Entidad
     * ------------------------------------------------ */
    $scope.rcareport = {
        incidencia: {},
        empresa: { id: 0 },
        sucursal: { id: 0 },
        solicitante: {},
        coordinador: {},
        cr: {}, // change request
        sla_failure: {},
        urgencia: {},
        impacto: {},
        prioridad: {},
        detail: {
            rcareport: {},
            // rca: {},
            // recomendacion: {},
            accepted_by: {},
            approval_by: {}
        }
    };
        
        
    /* ---------------------------------------------------
     * Observables 
     * --------------------------------------------------- */
	$scope.$watch('rcareport.empresa', function (newEmpresa, oldEmpresa) {
		getSucursalesByEmpresa(newEmpresa.id);
	}, true);
        
    $scope.$watch('rcareport.sucursal', function (newSucursal, oldSucursal) {
		getPersonalBySucursal(newSucursal.id);
	}, true);
    
    /* --------------------------------------------------
     * Recursos necesarios del servidor
     * -------------------------------------------------- */
    EmpresasResource.query({}, function (empresas) {
		$scope.empresas = empresas;
	});
        
    ImpactosResource.query({}, function (impactos) {
		$scope.impactos = impactos;
	});
       
    function getSucursalesByEmpresa(empresaId) {

		SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
			$scope.sucursales = sucursales;
		});
	}
        
    function getPersonalBySucursal(sucursalId) {
		PersonasFactory.getPersonasBySucursal(sucursalId)
			.success(function (personas) {
				$scope.personas = personas;
			})
			.error(function (error) {
				$scope.status = 'Unable to load personas(sucursal) data: ' + error.message;
			});
	}
    /* -----------------------------------------------------
     * Asignacion del recurso actual
     * ----------------------------------------------------- */
    RcareportResource.show({ id: $routeParams.id }, function (currentRcareport) {
        $scope.rcareport = currentRcareport;
        $scope.rcareport.prioridad = $scope.prioridades[$scope.rcareport.prioridad-1];
    });

    /* -----------------------------------------------------
     * Acciones principales
     * ----------------------------------------------------- */
    $scope.updateRcareport = function () {
        $log.info($scope.rcareport);
    };
}]);