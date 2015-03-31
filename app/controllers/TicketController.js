/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('TicketController',
	['$scope', '$modal', '$log', '$location'
    , 'AuthService'
	, 'TipoticketsResource'
	, 'EmpresasResource'
	, 'SucursalesResource'
	, 'SeveridadesResource'
	, 'IncClasesResource'
	, 'PersonasFactory'
	, 'AreasResource'
	, 'EstadosResource'
	, 'GruposResource'
	, 'TipificacionesResource'
	, 'ComponenteFactory'
	, 'TicketsResource'
	, 'TicketFactory'
	, 'AnexosFactory'
	, 'SolverResource'
	, function ($scope, $modal, $log, $location
        , AuthService
		, TipoticketsResource
		, EmpresasResource
		, SucursalesResource
		, SeveridadesResource
		, IncClasesResource
		, PersonasFactory
		, AreasResource
		, EstadosResource
		, GruposResource
		, TipificacionesResource
		, ComponenteFactory
		, TicketsResource
		, TicketFactory
		, AnexosFactory
		, SolverResource) {

	$scope.status;
	$scope.tickets = {};

	/* ------------------------------------------
     * Informacion utilizada
     * ------------------------------------------ */
	$scope.empresas = {};
	$scope.sucursales = {};
	$scope.areas = {}; // posible areas afectadas
	$scope.personas = {};
	$scope.tipoafectados = [
		{ id: 1, nombre: 'Sucursal'},
		{ id: 2, nombre: 'Area' },
		{ id: 3, nombre: 'Persona' }
	];
	$scope.grupos = {};
	$scope.asignados = {};
	$scope.tipotickets = {};
	$scope.severidades = {};
	$scope.incclases = {};
	$scope.prioridades = [
		{ id: 1, nombre: 'Prioridad 1' },
		{ id: 2, nombre: 'Prioridad 2' },
		{ id: 3, nombre: 'Prioridad 3' },
		{ id: 4, nombre: 'Prioridad 4' },
		{ id: 5, nombre: 'Prioridad 5' },
		{ id: 6, nombre: 'Prioridad 6' },
		{ id: 7, nombre: 'Prioridad 7' },
	];
	$scope.estados = {};

	// tipificaciones motivo
	$scope.tipificacionesN1 = {};
	$scope.tipificacionesN2 = {};
	$scope.tipificacionesN3 = {};
	$scope.tipificacionesN4 = {};
	$scope.tipificacionesN5 = {};

	/* -------------------------------------------
     * Entidad
     * -------------------------------------------*/
	$scope.ticket = {
		tipoticket: {},
		empresa: { id: 0 },
		sucursal: { id: 0 },
		severidad: {},
		clase: { id: 0 },
		prioridad: $scope.prioridades[3],
		reportador: {},
		tipoafectado: $scope.tipoafectados[2],
		persona_afectada: {},
		area_afectada: {},
		sucursal_afectada: {},
		estado: {},
		grupo: {},
		asignado: {},
        descripcion: '',
		tipificacion: {
			N1: { id: 0 },
			N2: { id: 0 },
			N3: { id: 0 },
			N4: { id: 0 },
			N5: { id: 0 },
		},
		referencia: {},
		componente: {},
		anexos: {},
		user: AuthService.getUser(),
    	solver_aut: {
    		soluciones: [],
    	}
	};

    // Control de envio y recepcion de respuesta del servidor.
    $scope.ticketObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

	/* -------------------------------------------------
     * Observables
     * ------------------------------------------------- */
	$scope.$watch('ticket.empresa', function (newEmpresa, oldEmpresa) {
		getSucursalesByEmpresa(newEmpresa.id);
        $scope.ticket.sucursal = { id: 0 };
	}, true);

	$scope.$watch('ticket.sucursal', function (newSucursal, oldSucursal) {
		getPersonalBySucursal(newSucursal.id);

        $scope.ticket.reportador = { id: 0 };
        $scope.ticket.persona_afectada = { id: 0 };
	}, true);

	$scope.$watch('ticket.tipoafectado', function (newTipoafectado, oldTipoafectado) {
		if (newTipoafectado.id == 1) { // sucursal
            $scope.ticket.persona_afectada = {};
            $scope.ticket.area_afectada = {};
		} else if (newTipoafectado.id == 2) { // area
            $scope.ticket.persona_afectada = {};
            $scope.ticket.sucursal_afectada = {};
		} else if (newTipoafectado.id == 3) { // persona
            $scope.ticket.sucursal_afectada = {};
            $scope.ticket.area_afectada = {};
		}
	}, true);

	$scope.$watch('ticket.grupo', function (newGrupo, oldGrupo) {
		$scope.asignados = []; // Limpia la lista de asignados
        $scope.ticket.asignado = {}; // Limpia el modelo
        if(newGrupo.id > 0) {
            getPersonalByGrupo(newGrupo.id);
        }
	}, true);

    $scope.$watch('ticket.clase', function (newClase, oldClase) {
        $scope.ticket.prioridad = $scope.prioridades[newClase.prioridad - 1];

        if(newClase.parent_id) {
        	$scope.ticket.tipificacion.N1 = $scope.tipificacionesN1[newClase.parent_id - 1];
        }
    });

	// tipificacion motivo
	$scope.$watch('ticket.tipificacion.N1', function (newTipificacion, oldTipificacion) {
		$scope.tipificacionesN2 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 }); // categoria_id: 3 -> problema
		$scope.ticket.tipificacion.N2 = { id: 0 }; // limpia el modelo
	});
	$scope.$watch('ticket.tipificacion.N2', function (newTipificacion, oldTipificacion) {
		$scope.tipificacionesN3 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
		$scope.ticket.tipificacion.N3 = { id: 0 }; // limpia el modelo
	});
	$scope.$watch('ticket.tipificacion.N3', function (newTipificacion, oldTipificacion) {
		$scope.tipificacionesN4 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
		$scope.ticket.tipificacion.N4 = { id: 0 }; // limpia el modelo
	});
	$scope.$watch('ticket.tipificacion.N4', function (newTipificacion, oldTipificacion) {
		$scope.tipificacionesN5 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
		$scope.ticket.tipificacion.N5 = { id: 0 }; // limpia el modelo
	});

	/* ------------------------------------------------------
     * Handlers
     * ------------------------------------------------------ */
	$scope.$on('handlerSelectedComponente', function() {
	    $scope.ticket.componente = ComponenteFactory.componente;
	});

	$scope.$on('handlerSelectedTicket', function() {
	    $scope.ticket.referencia = TicketFactory.ticket;
	});

	$scope.$on('handlerSetAnexos', function() {
		$scope.ticket.anexos = AnexosFactory.uploader;
	})

	/* -------------------------------------------------------
     * Obtiene los recursos necesarios del servidor
     * ------------------------------------------------------- */
	TipoticketsResource.query({}, function (tipotickets) {
		$scope.tipotickets = tipotickets;
		$scope.ticket.tipoticket = $scope.tipotickets[1]; // incidencia
	});

	EmpresasResource.query({}, function (empresas) {
		$scope.empresas = empresas;
		$scope.ticket.empresa = $scope.empresas[1]; // Budbay
	});

	SeveridadesResource.query({}, function (severidades) {
		$scope.severidades = severidades;
		$scope.ticket.severidad = $scope.severidades[3]; // Severidad 4
	});

	IncClasesResource.query({}, function (clases) {
		$scope.incclases = clases;
		$scope.ticket.clase = $scope.incclases[11]; // Otro
	});

	AreasResource.query({}, function (areas) {
		$scope.areas = areas;
	});

	EstadosResource.query({}, function (estados) {
		$scope.estados = estados;
		$scope.ticket.estado = $scope.estados[0]; // Abierto
	});

	GruposResource.query({}, function (grupos) {
		$scope.grupos = grupos;
		var gruponulo = {
			id: -1,
			nombre: "Sin definir",
			descripcion: "Sin definir"
		};
		$scope.grupos.push(gruponulo);
		$scope.ticket.grupo = $scope.grupos[$scope.grupos.length - 1];
	});

	TipificacionesResource.query({ nivel: 1 }, function (data) {
		$scope.tipificacionesN1 = data;
		$scope.ticket.tipificacion.N1 = $scope.tipificacionesN1[0]; // Hardware
	});

	function getSucursalesByEmpresa (empresaId) {

		SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
			$scope.sucursales = sucursales;
		});
	}

	function getPersonalBySucursal (sucursalId) {
		PersonasFactory.getPersonasBySucursal(sucursalId)
			.success(function (personas) {
				$scope.personas = personas;
			})
			.error(function (error) {
				$scope.status = 'Unable to load personas(sucursal) data: ' + error.message;
			});
	}

	function getPersonalByGrupo (grupoId) {
		PersonasFactory.getPersonalByGrupo(grupoId)
			.success( function (personal) {
				$scope.asignados = personal;
			})
			.error (function (error) {
				$scope.status = 'Unable to load personal(grupo) data: ' + error.message;
			});
	}

    function isCorrect () {
        // $log.info($scope.ticket);
        var correct = true;

        if($scope.ticket.sucursal.id == 0) correct = false;
        if($scope.ticket.reportador == 0) correct = false;

        if($scope.ticket.tipoafectado.id == 3) {
            if($scope.ticket.persona_afectada.id == 0 || $scope.ticket.persona_afectada == null) { correct = false; }
        }
        else if($scope.ticket.tipoafectado.id == 2) {
            if($scope.ticket.area_afectada.id == 0 || $scope.ticket.area_afectada == null) correct = false;
        }
        else if($scope.ticket.tipoafectado.id == 1) {
            if($scope.ticket.sucursal_afectada.id == 0 || $scope.ticket.sucursal_afectada == null) correct = false;
        }

        // $log.info(correct);
        return true;
    }

    // Calcular la prioridad
    function calcularPrioridad (impacto, urgencia) {
        if(impacto && urgencia) {
            switch(impacto.id) {
                case 3: // persona
                    // baja
                    if(urgencia.id == 4) return $scope.prioridades[3]; // baja
                    // media
                    if(urgencia.id == 3) return $scope.prioridades[2]; // media
                    // alta
                    if(urgencia.id == 2) return $scope.prioridades[2]; // media
                    // critica
                    if(urgencia.id == 1) return $scope.prioridades[1]; // alta
                    break;
                case 2: // area
                    // baja
                    if(urgencia.id == 4) return $scope.prioridades[3]; // baja
                    // media
                    if(urgencia.id == 3) return $scope.prioridades[2]; // media
                    // alta
                    if(urgencia.id == 2) return $scope.prioridades[1]; // alta
                    // critica
                    if(urgencia.id == 1) return $scope.prioridades[0]; // critica
                    break;
                case 1: // sucursal
                    // baja
                    if(urgencia.id == 4) return $scope.prioridades[3]; // baja
                    // media
                    if(urgencia.id == 3) return $scope.prioridades[1]; // alta
                    // alta
                    if(urgencia.id == 2) return $scope.prioridades[0]; // critica
                    // critica
                    if(urgencia.id == 1) return $scope.prioridades[0]; // critica
                    break;
            }
        }
    }

    // Control de envio y recepcion de respuesta del servidor.
    $scope.solverObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

    $scope.solver = function () {

    	// Bloque el boton hasta recibir respuesta del servidor.
    	$scope.solverObs.uploader.isLoading = true;

    	SolverResource.query($scope.ticket.tipificacion, function (response) {
            $scope.solverObs.uploader.isSuccess = true;
            $scope.solverObs.uploader.isError = false;
            $scope.ticket.solver_aut.soluciones = response;

            // Solucion encontrada.
        }, function (errorResponse) {
        	if (errorResponse.data.message) {
        		$scope.solverObs.uploader.message = errorResponse.data.message;
        	} else {
        		$scope.solverObs.uploader.message = 'Ocurrio un problema al obtener respuesta del servidor.';
        	}

        	$scope.ticket.solver_aut.soluciones = [];
        	$scope.solverObs.uploader.isError = true;
        	$scope.solverObs.uploader.isSuccess = false;
        });

        $scope.solverObs.uploader.isLoading = false;
    };

	/* -------------------------------------------------------------
     * Acciones principales
     * ------------------------------------------------------------- */
	$scope.newTicket = function (isValid) {

        // Verifica que todos los archivos hayan subido correctamente
        var completeUploadFiles = false;
        var countVal = 0;
        angular.forEach($scope.ticket.anexos.items, function(item) {
            if(item.isSuccess) {
                countVal++;
            }
        }, this);

        if(countVal != $scope.ticket.anexos.items.length) {
            alert('Algun elemento de los anexos aun no sube correctamente.');
        }

        // Si todo es correcto se envia al servidor
        if(isValid && (countVal == $scope.ticket.anexos.items.length) && isCorrect()) {

            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.ticketObs.uploader.isLoading = true;

            TicketsResource.create($scope.ticket, function (response) {

                $scope.ticketObs.uploader.isSuccess = true;
                $scope.ticketObs.uploader.message = response.message;

            }, function (error) {
                if(error.data.message) {
                    $scope.ticketObs.uploader.message = error.data.message;
                } else {
                    $scope.ticketObs.uploader.message = 'Error en el proceso de registro!';
                }

                $scope.ticketObs.uploader.isError = true;
            });

        }
	}
}]);
