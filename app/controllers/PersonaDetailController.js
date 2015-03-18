/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('PersonaDetailController', ['$scope', '$routeParams', '$log', '$location', '$stateParams'
	, 'PersonaResource'
	, 'EmpresasResource'
	, 'AreasResource'
	, 'GruposResource'
	, 'SucursalesResource'
	, 'CargosFactory'
	, 'GenerosFactory'
	, 'IGrupoFactory'
	, 'DTOptionsBuilder'
    , 'DTColumnDefBuilder'
	, function($scope, $routeParams, $log, $location, $stateParams
		, PersonaResource
		, EmpresasResource
		, AreasResource
		, GruposResource
		, SucursalesResource
		, CargosFactory
		, GenerosFactory
		, IGrupoFactory
		, DTOptionsBuilder
        , DTColumnDefBuilder) {

	/* ----------------------------------------------------
     * dtOptions - datatable
     * ---------------------------------------------------- */
    $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withPaginationType('full_numbers');


	/* ----------------------------------------------------------
     * Informacion utilizada
     * ---------------------------------------------------------- */
    $scope.generos = GenerosFactory.getGeneros();
	
	$scope.empresas = []
	$scope.sucursales = [];
    $scope.cargos = [];
	$scope.grupos = [];

    /* ----------------------------------------------------------
     * Entidad
     * ---------------------------------------------------------- */
    $scope.persona = {
    	empresa: { id: 0 },
    	sucursal: {},
    	updategrupos: false,
    };

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
     * Observables
     * ---------------------------------------------------------- */
	$scope.$watch('persona.empresa', function (newVal, oldVal) {
		if(newVal) {
			getSucursalesByEmpresa(newVal.id);
		}	
	}, true);

	$scope.$on('handlerPushGrupo', function() {
	    $scope.persona.trabajador.grupos = IGrupoFactory.grupos;
	});


    /* -----------------------------------------------------------------
     * Asignacion de la informacion de la tipificacion actual
     * ----------------------------------------------------------------- */
    PersonaResource.show({ id: $stateParams.id }, function (currentPersona) {
    	$scope.persona = currentPersona;
    	$scope.persona.genero = $scope.generos[currentPersona.genero - 1];
    	$scope.persona.istrabajador = currentPersona.trabajador != null ? true : false;

    	// Inicializa la interfaz de paso de datos entre controladores
        if($scope.persona.trabajador) {
            IGrupoFactory.grupos = $scope.persona.trabajador.grupos;

             angular.forEach($scope.persona.trabajador.grupos, function(item) {
                item.pivot.isResponsable = item.pivot.isResponsable == 1 ? true : false;
            }, this);
        }

    }, function (error) {
        $location.url('/404');
    });

    /* -------------------------------------------------------------------
     * Recursos necesarios
     * ------------------------------------------------------------------- */
    init();

    function init () {
    	getCargos();
    }

    EmpresasResource.query({}, function (empresas) {
		$scope.empresas = empresas;
	});

	
	AreasResource.query({}, function (areas) {
		$scope.areas = areas;
	});

	GruposResource.query({}, function (grupos) {
		$scope.grupos = grupos;
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
			})
			.error(function (error) {
				$scope.status = 'Unable to load cargos data: ' + error.message;
			});
	};

	/* ----------------------------------------------------
     * Acciones principales
     * ---------------------------------------------------- */
    $scope.removeItem = function (index) {
        $scope.persona.trabajador.grupos.splice(index, 1);
    };

    $scope.updatePersona = function (isValid) {
    	if(isValid) {

    		// Bloque el boton hasta recibir respuesta del servidor.
            $scope.persobaObs.uploader.isLoading = true;

            PersonaResource.update($scope.persona, function (response) {
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