/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('TicketDetailController',
	['$scope', '$modal', '$log', '$routeParams', '$location', '$stateParams', '$q'
        , 'AuthService'
		, 'EmpresasResource'
		, 'SucursalesResource'
		, 'AreasResource'
		, 'PersonasFactory'
		, 'GruposResource'
		, 'TipoticketsResource'
		, 'SeveridadesResource'
		, 'IncClasesResource'
		, 'EstadosResource'
		, 'TipificacionesResource'
		, 'TicketResource'
		, 'AnexosFactory'
		, 'TicketFactory'
		, 'ComponenteFactory'
		, 'SolverResource'
		, 'UbicacionesResource'
		, function($scope, $modal, $log, $routeParams, $location, $stateParams, $q
	        , AuthService
			, EmpresasResource
			, SucursalesResource
			, AreasResource
			, PersonasFactory
			, GruposResource
			, TipoticketsResource
			, SeveridadesResource
			, IncClasesResource
			, EstadosResource
			, TipificacionesResource
			, TicketResource
			, AnexosFactory
			, TicketFactory
			, ComponenteFactory
			, SolverResource
			, UbicacionesResource) {

	$scope.status;

	/* ------------------------------------------------
     * Informacion utilizada
     * ------------------------------------------------ */
	$scope.afectado_empresas = [];
	$scope.afectado_sucursales = [];
	$scope.solicitante_empresas = [];
	$scope.solicitante_sucursales = [];
	$scope.areas = []; // posible areas afectadas
	$scope.personas = [];
	$scope.solicitantes = [];
	$scope.afectados = [];
	$scope.tipoafectados = [
		{ id: 1, nombre: 'Site'},
		{ id: 2, nombre: 'Area' },
		{ id: 3, nombre: 'Persona' }
	];
	$scope.grupos = [];
	$scope.asignados = [];
	$scope.tipotickets = [];
	$scope.severidades = [];
	$scope.incclases = [];
	$scope.prioridades = [
		{ id: 1, nombre: 'Prioridad 1' },
		{ id: 2, nombre: 'Prioridad 2' },
		{ id: 3, nombre: 'Prioridad 3' },
		{ id: 4, nombre: 'Prioridad 4' },
		{ id: 5, nombre: 'Prioridad 5' },
		{ id: 6, nombre: 'Prioridad 6' },
		{ id: 7, nombre: 'Prioridad 7' },
	];
	$scope.estados = [];
	$scope.ubicaciones = [];

    // tipificaciones motivo
	$scope.tipificacionesN1 = [];
	$scope.tipificacionesN2 = [];
	$scope.tipificacionesN3 = [];
	$scope.tipificacionesN4 = [];
	$scope.tipificacionesN5 = [];
	// soluciones motivo
	$scope.solucionesN1 = [];
	$scope.solucionesN2 = [];
	$scope.solucionesN3 = [];
	$scope.solucionesN4 = [];
	$scope.solucionesN5 = [];

	/* --------------------------------------------------
     * Entidad
     * -------------------------------------------------- */
	$scope.ticket = {
		tipoticket: {},
		empresa_solicitante: { id: 0 },
		sucursal_solicitante: { id: 0 },
		empresa_afectado: { id: 0 },
		sucursal_afectado: { id: 0 },
		clase: {},
		severidad: {},
		prioridad: {},
		reportador: {},
		persona_afectada: {},
		area_afectada: {},
		sucursal_afectada: {},
		tipoafectado: { id: 0 },
		estado: {},
		ubicacion: {},
        updateMotivo: false,
        tipificacion: {
			N1: { id: 0 },
			N2: { id: 0 },
			N3: { id: 0 },
			N4: { id: 0 },
			N5: { id: 0 },
		},
		referencia: {},
		componente: {},
		movimientos: [],
		rcareports: [],
		currentMovimiento: {
            updateAsignado: false,
			grupo: { id: 0 },
			asignado: {},
            updateSolucion: false,
			solucion: {
				N1: { id: 0 },
				N2: { id: 0 },
				N3: { id: 0 },
				N4: { id: 0 },
				N5: { id: 0 },
			},
			anexos: {},
			user: AuthService.getUser()
		},
		solver_aut: {
    		soluciones: [],
    	},
		isGesProblema: false,
		isGesCambio : false,
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

	/* ---------------------------------------------------------------
     * Observables
     * --------------------------------------------------------------- */
	$scope.$watch('ticket.empresa_solicitante', function (newEmpresa, oldEmpresa) {
		if(newEmpresa !== oldEmpresa) {
			getSucursalesByEmpresaSolicitante(newEmpresa.id);
		}
	}, true);

	$scope.$watch('ticket.sucursal_solicitante', function (newSucursal, oldSucursal) {
		if(newSucursal !== oldSucursal) {
			getPersonalBySucursalSolicitante(newSucursal.id);
		}
	}, true);

	//
	$scope.$watch('ticket.empresa_afectado', function (newEmpresa, oldEmpresa) {
		if(newEmpresa !== oldEmpresa) {
			getSucursalesByEmpresaAfectado(newEmpresa.id);
		}
	}, true);

	$scope.$watch('ticket.sucursal_afectado', function (newSucursal, oldSucursal) {
		if(newSucursal !== oldSucursal) {
			getPersonalBySucursalAfectado(newSucursal.id);
		}
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

	$scope.$watch('ticket.currentMovimiento.grupo', function (newGrupo, oldGrupo) {
		if(newGrupo) {
	        if(newGrupo.id > 0) {
	            getPersonalByGrupo(newGrupo.id);

	            if($scope.ticket.currentMovimiento.updateAsignado) {
	                $scope.ticket.currentMovimiento.asignado = {};
	            }
	        }
		}
	}, true);

	$scope.$watch('ticket.clase', function (newClase, oldClase) {
        $scope.ticket.prioridad = $scope.prioridades[newClase.prioridad - 1];

        if(newClase.parent_id) {
        	$scope.ticket.tipificacion.N1 = $scope.tipificacionesN1[newClase.parent_id - 1];
        }
    });

    // nueva tipificacion motivo
	$scope.$watch('ticket.tipificacion.N1', function (newTipificacion, oldTipificacion) {
		if(newTipificacion !== oldTipificacion && newTipificacion !== undefined) {

			if(!isNaN(newTipificacion.id)) {
				$scope.tipificacionesN2 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 }); // categoria_id: 3 -> problema
			}

	        if($scope.ticket.updateMotivo) {
	            $scope.ticket.tipificacion.N2 = { id: 0 };
	        }
		}

    });
	$scope.$watch('ticket.tipificacion.N2', function (newTipificacion, oldTipificacion) {

		if(newTipificacion !== oldTipificacion && newTipificacion !== undefined) {
			if(!isNaN(newTipificacion.id)) {
				$scope.tipificacionesN3 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
			}

	        if($scope.ticket.updateMotivo) {
	            $scope.ticket.tipificacion.N3 = { id: 0 };
	        }
		}

	});
	$scope.$watch('ticket.tipificacion.N3', function (newTipificacion, oldTipificacion) {

		if(newTipificacion !== oldTipificacion && newTipificacion !== undefined) {
			if(!isNaN(newTipificacion.id)) {
				$scope.tipificacionesN4 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
			}

	        if($scope.ticket.updateMotivo) {
	            $scope.ticket.tipificacion.N4 = { id: 0 };
	        }
		}

	});
	$scope.$watch('ticket.tipificacion.N4', function (newTipificacion, oldTipificacion) {

		if(newTipificacion !== oldTipificacion && newTipificacion !== undefined) {
			if(!isNaN(newTipificacion.id)) {
				$scope.tipificacionesN5 = TipificacionesResource.query({ parent_id: newTipificacion.id, categoria_id: 3 });
			}

			if($scope.ticket.updateMotivo) {
	            $scope.ticket.tipificacion.N5 = { id: 0 };
	        }
		}

	});

	// solucion motivo
	$scope.$watch('ticket.currentMovimiento.solucion.N1', function (newSolucion, oldSolucion) {
		if(newSolucion !== oldSolucion && newSolucion !== undefined) {
			if(!isNaN(newSolucion.id)) {
				$scope.solucionesN2 = TipificacionesResource.query({ parent_id: newSolucion.id, categoria_id: 2 }); // categoria_id: 2 -> solucion
			}

			if($scope.ticket.currentMovimiento.updateSolucion) {
	            $scope.ticket.currentMovimiento.solucion.N2 = { id: 0 };
	        }
		}

	});
	$scope.$watch('ticket.currentMovimiento.solucion.N2', function (newSolucion, oldSolucion) {
		if(newSolucion !== oldSolucion && newSolucion !== undefined) {
			if(!isNaN(newSolucion.id)) {
				$scope.solucionesN3 = TipificacionesResource.query({ parent_id: newSolucion.id, categoria_id: 2 });
	        }

	        if($scope.ticket.currentMovimiento.updateSolucion) {
	            $scope.ticket.currentMovimiento.solucion.N3 = { id: 0 };
	        }
		}

	});
	$scope.$watch('ticket.currentMovimiento.solucion.N3', function (newSolucion, oldSolucion) {
		if(newSolucion !== oldSolucion && newSolucion !== undefined) {
			if(!isNaN(newSolucion.id)) {
				$scope.solucionesN4 = TipificacionesResource.query({ parent_id: newSolucion.id, categoria_id: 2 });
	        }

			if($scope.ticket.currentMovimiento.updateSolucion) {
	            $scope.ticket.currentMovimiento.solucion.N4 = { id: 0 };
	        }
		}

	});
	$scope.$watch('ticket.currentMovimiento.solucion.N4', function (newSolucion, oldSolucion) {
		if(newSolucion !== oldSolucion && newSolucion !== undefined) {
			if(!isNaN(newSolucion.id)) {
				$scope.solucionesN5 = TipificacionesResource.query({ parent_id: newSolucion.id, categoria_id: 2 });
	        }

			if($scope.ticket.currentMovimiento.updateSolucion) {
	            $scope.ticket.currentMovimiento.solucion.N5 = { id: 0 };
	        }
		}

	});

	// Si es gestion del problema enviamos el ticket actual para cargar datos por defecto
	$scope.$watch('ticket.isGesProblema', function (newVal, olVal) {
		TicketFactory.selectItem($scope.ticket);
	});

	$scope.$watch('ticket.currentMovimiento.fechaprogramado', function (newVal, oldVal) {
		// Fecha sin zona horaria.
		var date = new Date($scope.ticket.currentMovimiento.fechaprogramado);
		$scope.ticket.currentMovimiento.fecha_programado = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	});

	/* -----------------------------------------------------
     * Handlers
     * ----------------------------------------------------- */
	$scope.$on('handlerSelectedComponente', function() {
	    $scope.ticket.componente = ComponenteFactory.componente;
	});

	$scope.$on('handlerSelectedTicket', function() {
	    $scope.ticket.referencia = TicketFactory.ticket;
	});

	$scope.$on('handlerSetAnexos', function() {
		$scope.ticket.currentMovimiento.anexos = AnexosFactory.uploader;
	})

	/* -----------------------------------------------------
     * Obtiene los recursos necesarios del servidor
     * ----------------------------------------------------- */
	function loadEmpresas() {
		return EmpresasResource.query({}, function (empresas) {
			$scope.solicitante_empresas = empresas;
			$scope.afectado_empresas = empresas;
			return $scope.afectado_empresas;
		});
	}

	function loadAreas() {
		return AreasResource.query({}, function (areas) {
			$scope.areas = areas;
			return $scope.areas;
		});
	}

	function loadGrupos() {
		return GruposResource.query({}, function (grupos) {
			$scope.grupos = grupos;
			return $scope.grupos;
		});
	}

	function loadTipotickets() {
		return TipoticketsResource.query({}, function (tipotickets) {
			$scope.tipotickets = tipotickets;
			return $scope.tipotickets;
		});
	}
	
	function loadUbicaciones() {
		return UbicacionesResource.query({}, function (ubicaciones) {
			$scope.ubicaciones = ubicaciones;
			var ubicacionnulo = {
				id: -1,
				nombre: "Sin definir",
				descripcion: "Sin definir"
			};
			$scope.ubicaciones.push(ubicacionnulo);
		});
	}

	function loadSeveridades() {
		return SeveridadesResource.query({}, function (severidades) {
			$scope.severidades = severidades;
			return $scope.severidades;
		});
	}

	function loadIncClases() {
		return IncClasesResource.query({}, function (clases) {
			$scope.incclases = clases;
			return $scope.incclases;
		});
	}

	function loadEstados() {
		return EstadosResource.query({}, function (estados) {
			$scope.estados = estados;
			return $scope.estados;
		});
	}

	function loadTipificacionesL1() {
		return TipificacionesResource.query({ nivel: 1 }, function (data) {
			$scope.tipificacionesN1 = data;
			$scope.solucionesN1 = data;
			return $scope.solucionesN1;
		});
	}

	function getSucursalesByEmpresaSolicitante (empresaId) {
		SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
			$scope.solicitante_sucursales = sucursales;
		});
	}

	function getPersonalBySucursalSolicitante (sucursalId) {
		PersonasFactory.getPersonasBySucursal(sucursalId)
			.success(function (personas) {
				$scope.solicitantes = personas;
			})
			.error(function (error) {
				$scope.status = 'Unable to load solicitantes data: ' + error.message;
			});
	}

	function getSucursalesByEmpresaAfectado (empresaId) {
		SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
			$scope.afectado_sucursales = sucursales;
		});
	}

	function getPersonalBySucursalAfectado (sucursalId) {
		PersonasFactory.getPersonasBySucursal(sucursalId)
			.success(function (personas) {
				$scope.afectados = personas;
			})
			.error(function (error) {
				$scope.status = 'Unable to load afectados data: ' + error.message;
			});
	}

	function getPersonalByGrupo(grupoId) {
		PersonasFactory.getPersonalByGrupo(grupoId)
			.success( function (personal) {
				$scope.asignados = personal;
			})
			.error (function (error) {
				$scope.status = 'Unable to load personal(grupo) data: ' + error.message;
			});
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
	/* -------------------------------------------------------
     * Acciones principales
     * ------------------------------------------------------- */
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
	$scope.updateTicket = function (isValid) {

		// $log.info($scope.ticket);
        // Verifica que todos los archivos hayan subido correctamente
        var completeUploadFiles = false;
        var countVal = 0;
        angular.forEach($scope.ticket.currentMovimiento.anexos.items, function(item) {
            if(item.isSuccess) {
                countVal++;
            }
        }, this);

        if(countVal != $scope.ticket.currentMovimiento.anexos.items.length) {
            alert('Algun elemento de los anexos aun no sube correctamente.');
        }

        if(isValid && (countVal == $scope.ticket.currentMovimiento.anexos.items.length)) {

            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.ticketObs.uploader.isLoading = true;

            TicketResource.update($scope.ticket, function (response) {

                $scope.ticketObs.uploader.isSuccess = true;
                $scope.ticketObs.uploader.message = response.message;

				// $location.url('/tickets');
            }, function (error) {
                if(error.data.message) {
                    $scope.ticketObs.uploader.message = error.data.message;
                } else {
                    $scope.ticketObs.uploader.message = 'Error en el proceso de registro!';
                    $log.info(error);
                }

                $scope.ticketObs.uploader.isError = true;

            });
        }
	}

	loadResources();
	// Load current ticket.
	loadCurrent();

	function loadResources() {
		var promises = [loadEmpresas(), loadAreas(), loadGrupos(), loadTipotickets(), loadSeveridades(), loadIncClases(), loadEstados(), loadTipificacionesL1(), loadUbicaciones()];

		return $q.all(promises).then(function () {
			console.log('Resources load complete');
		});
	}

	function loadResourcesDepends() {
		var promises = [];

		return $q.all(promises).then(function () {
			console.log('Resources depends load complete');
		});
	}

	function loadCurrent() {
		var promises = [getCurrent()];

		return $q.all(promises).then(function () {
			console.log('Current ticket load complete');
		});
	}

	function getCurrent() {
		/* -----------------------------------------------------------------
	     * Asignacion de la informacion del ticket actual
	     * ----------------------------------------------------------------- */
		return TicketResource.show({ id: $stateParams.id }, function (currentTicket) {
			$scope.ticket.solver_aut = {
	    		soluciones: [],
	    	};
			// Inicializacion
			$scope.ticket.id = currentTicket.id;
			$scope.ticket.prefijo = currentTicket.prefijo;
			$scope.ticket.correlativo = currentTicket.correlativo;
			$scope.ticket.asunto = currentTicket.asunto;
			$scope.ticket.ubicacion = currentTicket.ubicacion;

			$scope.ticket.empresa_solicitante = currentTicket.empresa_solicitante;
			$scope.ticket.sucursal_solicitante = currentTicket.sucursal_solicitante;
			$scope.ticket.reportador = currentTicket.reportado_by;

			$scope.ticket.empresa_afectado = currentTicket.empresa_afectado;
			$scope.ticket.sucursal_afectado = currentTicket.sucursal_afectado;
			if( currentTicket.afectado_id != null) {
				$scope.ticket.tipoafectado = $scope.tipoafectados[2]; // persona
				$scope.ticket.persona_afectada = currentTicket.afectado;
			}
			else if(currentTicket.afectado_area_id != null) {
				$scope.ticket.tipoafectado = $scope.tipoafectados[1]; // area
				$scope.ticket.area_afectada = currentTicket.area_afectada;
			}
			else if(currentTicket.afectado_sucursal_id != null) {
				$scope.ticket.tipoafectado = $scope.tipoafectados[0]; // site
				$scope.ticket.sucursal_afectada = currentTicket.sucursal_afectada;
			}

	        var movimientosLength = currentTicket.movimientos.length;

			$scope.ticket.currentMovimiento.grupo = currentTicket.movimientos[movimientosLength - 1].grupo;
			$scope.ticket.currentMovimiento.asignado = currentTicket.movimientos[movimientosLength - 1].asignado;
	        $scope.ticket.currentMovimiento.fechaprogramado = currentTicket.movimientos[movimientosLength - 1].fecha_programado;

			$scope.ticket.tipoticket = currentTicket.tipo;
			$scope.ticket.severidad = currentTicket.severidad;
			$scope.ticket.clase = currentTicket.clase;
			$scope.ticket.prioridad = $scope.prioridades[currentTicket.prioridad-1];
			$scope.ticket.estado = currentTicket.estado;
			$scope.ticket.descripcion = currentTicket.descripcion;
			$scope.ticket.private_descripcion = currentTicket.private_descripcion;

			// Estado 5: Cerrado.
			if($scope.ticket.estado.id == "5") {
				$scope.ticket.isCerrado = true;
			} else {
				$scope.ticket.isCerrado = false;
			}

			$scope.ticket.referencia = currentTicket.parent;
			$scope.ticket.componente = currentTicket.funcionalic;

	        // Transforma la informacion de tipificaciones motivo separada por comas e.j. "{1,5,8,20}"
			var partOfString = currentTicket.tipificaciones_inicial.substr(1, currentTicket.tipificaciones_inicial.length - 2).split(',');
	        // Asociamos los valores a las tipificaciones anteriores
			$scope.ticket.tipificacion.N1 = { id: partOfString[0] != "" && partOfString[0] != undefined ? partOfString[0] : 0 };
			$scope.ticket.tipificacion.N2 = { id: partOfString[1] != "" && partOfString[1] != undefined ? partOfString[1] : 0 };
			$scope.ticket.tipificacion.N3 = { id: partOfString[2] != "" && partOfString[2] != undefined ? partOfString[2] : 0 };
			$scope.ticket.tipificacion.N4 = { id: partOfString[3] != "" && partOfString[3] != undefined ? partOfString[3] : 0 };
			$scope.ticket.tipificacion.N5 = { id: partOfString[4] != "" && partOfString[4] != undefined ? partOfString[4] : 0 };

			// console.log($scope.ticket.tipificacion.);

	        // Transforma la informacion de tipificaciones solucion separada por comas e.j. "{1,5,8,20,30}"
	        var lengthTipificacionesFinal = currentTicket.movimientos[movimientosLength - 1].tipificaciones_final.length;
	        var partSoluciones = currentTicket.movimientos[movimientosLength - 1].tipificaciones_final.substr(1, lengthTipificacionesFinal - 2).split(',');
	        // $log.info(partSoluciones[1]);
	        $scope.ticket.currentMovimiento.solucion.N1 = { id: (partSoluciones[0] != "" && partSoluciones[0] != undefined ? partSoluciones[0] : 0) };
	        $scope.ticket.currentMovimiento.solucion.N2 = { id: (partSoluciones[1] != "" && partSoluciones[1] != undefined ? partSoluciones[1] : 0) };
	        $scope.ticket.currentMovimiento.solucion.N3 = { id: (partSoluciones[2] != "" && partSoluciones[2] != undefined ? partSoluciones[2] : 0) };
	        $scope.ticket.currentMovimiento.solucion.N4 = { id: (partSoluciones[3] != "" && partSoluciones[3] != undefined ? partSoluciones[3] : 0) };
	        $scope.ticket.currentMovimiento.solucion.N5 = { id: (partSoluciones[4] != "" && partSoluciones[4] != undefined ? partSoluciones[4] : 0) };

			// separar por las comas, asignarle a cada nivel
			$scope.ticket.movimientos = currentTicket.movimientos;

	        // Transforma la informacion de anexos
	        angular.forEach($scope.ticket.movimientos, function(movimiento) {
	            var lengthAnexos = movimiento.anexos.length;

	            if(lengthAnexos > 2) {
	                var anexosAll = movimiento.anexos.substr(2, lengthAnexos - 4).split('},{');

	                movimiento.anexosSplit = [];

	                if(anexosAll.length > 0) {
	                    angular.forEach(anexosAll, function (splitString) {

	                        var parts = splitString.split(',');
	                        var splitpart = { href: appUrl + '/' + parts[0].substr(1, parts[0].length - 2), description: parts[1] };

	                        // agrega al array el nuevo objeto
	                        movimiento.anexosSplit.push(splitpart);

	                    }, this);
	                }
	            }
	        }, this);
			return $scope.ticket;
		}, function (error) {
			$log.info('Error produccido al obtener la informacion del servidor.');
			$location.url('/404');
		});

	}
}]);
