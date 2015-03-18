/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ElementoController', ['$scope', '$log', '$location'
    , 'EmpresasResource'
    , 'SucursalesResource'
    , 'EstadoscisResource'
    , 'ImpactosResource'
    , 'ClasificacionicsResource'
    , 'ComponentesResource'
    , 'MarcasResource'
    , 'ComponenteFactory'
    , 'DTOptionsBuilder'
    , 'DTColumnDefBuilder'
    , function ($scope, $log, $location
        , EmpresasResource
        , SucursalesResource
        , EstadoscisResource
        , ImpactosResource
        , ClasificacionicsResource
        , ComponentesResource
        , MarcasResource
        , ComponenteFactory
        , DTOptionsBuilder
        , DTColumnDefBuilder) {

    // Inicializa la interfaz de paso de datos entre controladores
    ComponenteFactory.componentes = [];
                                          
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
        empresa: {},
        sucursal: {},
        estado: {},
        proveedor: {},
        clase: $scope.clases[0],
        clasificacion: {},
        showelementoshw: false,
        hardware: {
            marca: {},
            wirelessdevice: {
                tipo: $scope.tiposWirelss[1],
                dbi: 5,
            },
            pclaptop: {
                tipo: $scope.pclaptopTipos[1],
                ram: 8,
                hdd: 500,
            },
            server: {
                ram: 8,
                hdd: 1000,
            },
            tablet: {
                ram: 1,
                storage: 8,
            },  
        },
        software: {
            familia: $scope.familias[0],
            arquitectura: $scope.arquitecturas[0],
            virtualmachine: {
                ram: 8,
                hdd: 20,
            },
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

    /* ----------------------------------------------------
     * dtOptions - datatable
     * ---------------------------------------------------- */
    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withPaginationType('full_numbers');

    /* ------------------------------------------------------
     * Handlers
     * ------------------------------------------------------ */
    $scope.$on('handlerPushComponente', function() {
        $scope.elemento.parents = ComponenteFactory.componentes;
    });
    

    /* ----------------------------------------------------------
     * Recursos necesarios
     * ---------------------------------------------------------- */
    EmpresasResource.query({}, function (empresas) {
        $scope.empresas = empresas;
        $scope.elemento.empresa = $scope.empresas[1]; // Budbay
    });
                                          
    EstadoscisResource.query({}, function (estadoscis) {
        $scope.estados = estadoscis;
        $scope.elemento.estado = $scope.estados[4]; // En almacen 
    });

    MarcasResource.query({}, function (marcas) {
        $scope.marcas = marcas;
        $scope.elemento.hardware.marca = $scope.marcas[0];
    });

    ImpactosResource.query({}, function (impactos) {
        $scope.impactos = impactos;
        $scope.elemento.criticidad = $scope.impactos[2];
    });
                                          
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
                $scope.elemento.clasificacion = $scope.clasificaciones[0];
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

    $scope.newElemento = function (isValid) {
        if(isValid) {

            // $log.info($scope.elemento);
            // Bloque el boton hasta recibir respuesta del servidor.
            $scope.elementoObs.uploader.isLoading = true;

            ComponentesResource.create($scope.elemento, function (response) {
                $scope.elementoObs.uploader.isSuccess = true;
                $scope.elementoObs.uploader.message = response.message;

                // $location.url('/elementos');
            }, function (error) {
                if(error.data.message) {
                    $scope.elementoObs.uploader.message = error.data.message;
                } else {
                    $scope.elementoObs.uploader.message = 'Error en el proceso de registro!';
                    $log.info(error);
                }
               
                $scope.elementoObs.uploader.isError = true;
            });
        }  
    };
}]);