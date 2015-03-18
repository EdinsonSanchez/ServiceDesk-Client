/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('PersonaController', 
	['$scope', '$location', 'PersonasFactory', 'GenerosFactory', 'EmpresasResource', 'SucursalesResource', 'CargosFactory', 'AreasResource', 'GruposResource', 
	function ($scope, $location, PersonasFactory, GenerosFactory, EmpresasResource, SucursalesResource, CargosFactory, AreasResource, GruposResource) {
	
    /* ----------------------------------------------------------
     * Informacion utilizada
     * ---------------------------------------------------------- */
	$scope.status;
	$scope.generos = GenerosFactory.getGeneros();
	
	$scope.empresas = []
	$scope.sucursales = [];
    $scope.cargos = [];
	$scope.grupos = [];

        
    /* ----------------------------------------------------------
     * Observables
     * ---------------------------------------------------------- */
	$scope.$watch('persona.empresa', function (newVal, oldVal) {
		getSucursalesByEmpresa(newVal.id);
	}, true);

    /* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.persona = {};
	$scope.persona.empresa = { id: 0 };
	$scope.persona.genero = $scope.generos[0]; // Hombre
	$scope.persona.istrabajador = false;
	$scope.persona.isresponsable = false;

	// Control de envio y recepcion de respuesta del servidor.
    $scope.persobaObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

    /* ----------------------------------------------------------
     * Recursos necesarios
     * ---------------------------------------------------------- */
	init();

	function init() {
		getCargos();
	}

	EmpresasResource.query({}, function (empresas) {
		$scope.empresas = empresas;
		$scope.persona.empresa = $scope.empresas[1]; // Budbay
	});

	
	AreasResource.query({}, function (areas) {
		$scope.areas = areas;
		$scope.persona.area = $scope.areas[2];
	});

	GruposResource.query({}, function (grupos) {
		$scope.grupos = grupos;
		$scope.persona.grupo = $scope.grupos[0];
	});

	function getSucursalesByEmpresa(empresaId) {

		SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
			$scope.sucursales = sucursales;
		});
	}

	function getCargos() {
		CargosFactory.getCargos()
			.success(function (cargos) {
				$scope.cargos = cargos;
				$scope.persona.cargo = $scope.cargos[3];
			})
			.error(function (error) {
				$scope.status = 'Unable to load cargos data: ' + error.message;
			});
	}


	/* ---------------------------------------------------------
     * Acciones principales
     * --------------------------------------------------------- */
	$scope.newPersona = function (isValid) {
        
        if(isValid) {

        	// Bloque el boton hasta recibir respuesta del servidor.
            $scope.persobaObs.uploader.isLoading = true;

            PersonasFactory.postPersona($scope.persona)
                .then(function (response) {
                    
                    $scope.persobaObs.uploader.isSuccess = true;
                	$scope.persobaObs.uploader.message = response.message;

                }, function (error) {
                	
                    if(error.data.message) {
	                    $scope.persobaObs.uploader.message = error.data.message;
	                } else {
	                    $scope.persobaObs.uploader.message = 'Error en el proceso de registro!';
	                    $log.info(error);
	                }
	               
	                $scope.persobaObs.uploader.isError = true;
                });
        }
	};
}]);