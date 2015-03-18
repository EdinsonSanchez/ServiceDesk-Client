/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('RcareportController', 
	['$scope', '$log', '$location'
	, 'EmpresasResource'
	, 'SucursalesResource'
	, 'PersonasFactory'
	, 'ImpactosResource'
	, 'RcareportsResource'
	, 'TicketFactory'
	, 'SeveridadesResource'
	, function($scope, $log, $location
		, EmpresasResource
		, SucursalesResource
		, PersonasFactory
		, ImpactosResource
		, RcareportResource
		, TicketFactory
		, SeveridadesResource) {
	
	$scope.status = {};

	/* Informacion utilizada */
	$scope.empresas = [];
	$scope.sucursales = [];
	$scope.personas = [];
	$scope.prioridades = [
		{ id: 1, nombre: 'Critica' },
		{ id: 2, nombre: 'Alta' },
		{ id: 3, nombre: 'Media' },
		{ id: 4, nombre: 'Baja' }
	];


	/* Entidad */
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
		prioridad: $scope.prioridades[3],
		detail: {
			rcareport: {},
			// rca: {},
			// recomendacion: {},
			accepted_by: {},
			approval_by: {}
		}
	};

	// Control de envio y recepcion de respuesta del servidor.
    $scope.rcareportObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

	/* Observables */
	$scope.$watch('rcareport.empresa', function (newEmpresa, oldEmpresa) {
		getSucursalesByEmpresa(newEmpresa.id);
	}, true);

	$scope.$watch('rcareport.sucursal', function (newSucursal, oldSucursal) {
		getPersonalBySucursal(newSucursal.id);
	}, true);

	/* handlers */
	$scope.$on('handlerSelectTicket', function() {

		// Asignacion del objeto
	    $scope.rcareport.incidencia = TicketFactory.ticket;
		$scope.rcareport.empresa = $scope.rcareport.incidencia.empresa;
		$scope.rcareport.sucursal = $scope.rcareport.incidencia.sucursal;
	});

	/* end-handlers*/

	// Obtiene los recursos necesarios
	EmpresasResource.query({}, function (empresas) {
		$scope.empresas = empresas;
	});

	ImpactosResource.query({}, function (impactos) {
		$scope.impactos = impactos;
		$scope.rcareport.impacto = $scope.impactos[2]; // Bajo
	});

	SeveridadesResource.query({}, function (severidades) {
		$scope.severidades = severidades;
		$scope.rcareport.severidad = $scope.severidades[3]; // Severidad 4
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

	//-----------------------
	$scope.newRcaReport = function (isValid) {
		$log.info(isValid);

		if(isValid) {
			$log.info('<---------------->');

            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.rcareportObs.uploader.isLoading = true;

			RcareportResource.create($scope.rcareport, function (response) {

				$scope.rcareportObs.uploader.isSuccess = true;
                $scope.rcareportObs.uploader.message = response.message;

			}, function (error) {
				if(error.data.message) {
					$scope.rcareportObs.uploader.message = error.data.message;
				} else {
					$scope.rcareportObs.uploader.message = 'Error en el proceso de registro!';
					$log.info($scope.rcareport);
				}

				$scope.rcareportObs.uploader.isError = true;
			});
		}
		
	};
}]);