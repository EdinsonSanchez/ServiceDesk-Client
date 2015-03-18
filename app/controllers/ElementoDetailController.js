/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ElementoDetailController', ['$scope', '$routeParams', '$location', '$log', '$stateParams'
	, 'ComponenteResource'
	, 'ComponenteFactory'
	, 'EmpresasResource'
    , 'MarcasResource'
	, 'SucursalesResource'
	, 'ImpactosResource'
	, 'EstadoscisResource'
	, 'ClasificacionicsResource'
    , 'AuthService'
	, 'DTOptionsBuilder'
    , 'DTColumnDefBuilder'
	, function($scope, $routeParams, $location, $log, $stateParams
		, ComponenteResource
		, ComponenteFactory
		, EmpresasResource
        , MarcasResource
		, SucursalesResource
		, ImpactosResource
		, EstadoscisResource
		, ClasificacionicsResource
        , AuthService
		, DTOptionsBuilder
        , DTColumnDefBuilder) {

	/* ----------------------------------------------------
     * dtOptions - datatable
     * ---------------------------------------------------- */
    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withPaginationType('full_numbers');

    /* ----------------------------------------------------------
     * Informacion utilizada
     * ---------------------------------------------------------- */
    $scope.empresas = [];
    $scope.sucursales = [];
    $scope.estados = [];
    $scope.clasificacionesHw = [];
    $scope.clasificacionesSw = [];
    $scope.marcas = [];
    $scope.tiposWirelss = [
        { id: 1, nombre: 'Onmidireccional' },
        { id: 2, nombre: 'Bidireccional' }
    ];
    $scope.pclaptopTipos = [
        { id: 1, nombre: 'Escritorio'},
        { id: 2, nombre: 'Laptop'}
    ];

    $scope.clases = [
        { id: 1, nombre: 'Hardware' },
        { id: 2, nombre: 'Software' },
        { id: 3, nombre: 'Documento' }
    ];
    
    $scope.arquitecturas = [
        { id: 1, nombre: '64 Bits' },
        { id: 2, nombre: '32 Bits' },
    ];
    $scope.familias = [
        { id: 1, nombre: 'Windows' },
        { id: 2, nombre: 'Linux' },
        { id: 3, nombre: 'Mac' },
        { id: 4, nombre: 'Multiplataforma'},
    ];

    /* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.elemento = {
        empresa: { id: 0 },
        sucursal: {},
        estado: {},
        proveedor: {},
        clase: {},
        clasificacion: {},
        showelementoshw: false,
        hardware: {},
        software: {
        	familia: {},
        	arquitectura: {}
        },
        parents: [],
    };

    // Rutas para incluir formularios externos
    $scope.path = {
        partials: 'views/elementos/partials/',
    };

    // Control de envio y recepcion de respuesta del servidor.
    $scope.elementoObs = {
        uploader: {
            isSuccess: false,
            isError: false,
            isLoading: false,
            message: '',
        }
    };

	/* ------------------------------------------------------
     * Handlers
     * ------------------------------------------------------ */
    $scope.$on('handlerPushComponente', function() {
        $scope.elemento.parents = ComponenteFactory.componentes;
    });
    
	
	/* -----------------------------------------------------------------
     * Asignacion de la informacion del ticket actual
     * ----------------------------------------------------------------- */
	ComponenteResource.show({ id: $stateParams.id }, function (currentElemento) {
		$scope.elemento = currentElemento;
        $scope.elemento.user = AuthService.getUser();

		if(currentElemento.hardware != null) {
			$scope.elemento.clase = $scope.clases[0]; // hw


            // wireless device
            if($scope.elemento.clasificacion.id == 3) {
                $scope.elemento.hardware.wirelessdevice.tipo = $scope.tiposWirelss[currentElemento.hardware.wirelessdevice.tipo - 1];
            }
            // pclaptop
            else if ($scope.elemento.clasificacion.id == 5) {
                $scope.elemento.hardware.pclaptop.tipo = $scope.pclaptopTipos[currentElemento.hardware.pclaptop.tipo -1];
            }

		} else if(currentElemento.software != null ) {
			$scope.elemento.clase = $scope.clases[1]; // sw
            // Configuracion personalizada para selects.
			$scope.elemento.software.familia = $scope.familias[currentElemento.software.familia - 1];
			$scope.elemento.software.arquitectura = $scope.arquitecturas[currentElemento.software.tipo - 1];
		}

		// Inicializa la interfaz de paso de datos entre controladores
        ComponenteFactory.componentes = currentElemento.parents;

	}, function (error) {
		$location.url('/404');
	});

	/* ----------------------------------------------------------
     * Recursos necesarios
     * ---------------------------------------------------------- */
    EmpresasResource.query({}, function (empresas) {
        $scope.empresas = empresas;
    });

    ImpactosResource.query({}, function (impactos) {
        $scope.impactos = impactos;
    });

    EstadoscisResource.query({}, function (estadoscis) {
        $scope.estados = estadoscis;
    });

    MarcasResource.query({}, function (marcas) {
        $scope.marcas = marcas;
    })

    function getSucursalesByEmpresa(empresaId) {
        SucursalesResource.query({ empresaId: empresaId }, function (sucursales) {
            $scope.sucursales = sucursales;
        });
    }

    /* ----------------------------------------------------------
     * Observables
     * ---------------------------------------------------------- */
	$scope.$watch('elemento.empresa', function (newEmpresa, oldEmpresa) {
        if(newEmpresa.id > 0) {
            getSucursalesByEmpresa(newEmpresa.id);
        }
	}, true);

	$scope.$watch('elemento.clase', function (newClase, oldClase) {
        if(newClase.id > 0) {
            ClasificacionicsResource.query({ claseId: newClase.id }, function (clasificaciones) {
                $scope.clasificaciones = clasificaciones;
            });
        }
    }, true);

    $scope.$watch('elemento.clasificacion', function (newClasificacion, oldClasificacion) {
        if(newClasificacion) {
            if(newClasificacion.id > 0) {

                var pathAll = $scope.path.partials + newClasificacion.alias + '.html';

                if($scope.elemento.clase.id == 1) { // hardware
                    $scope.includeHw = pathAll;
                }
                else if($scope.elemento.clase.id == 2) { // software
                    $scope.includeSw = pathAll;
                }
            }
        }
    }, true);

	/* ----------------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------------- */
    $scope.removeItemHw = function (index) {
        $scope.elemento.parents.splice(index, 1);
    };

    $scope.updateElemento = function (isValid) {
        if(isValid) {

            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.elementoObs.uploader.isLoading = true;

            ComponenteResource.update($scope.elemento, function (response) {
                $scope.elementoObs.uploader.isSuccess = true;
                $scope.elementoObs.uploader.message = response.message;

            }, function (error) {
                if(error.data.message) {
                    $scope.elementoObs.uploader.message = error.data.message;
                } else {
                    $scope.elementoObs.uploader.message = 'Error en el proceso de registro!';
                    $log.info(error);
                }
               
                $scope.elementoObs.uploader.isError = true;
            });
        };
    };

}]);