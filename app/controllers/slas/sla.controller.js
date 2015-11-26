(function () {
  'use strict';

  angular
    .module('SDApp')
    .controller('SlaController', SlaController);

  SlaController.$inject = ['$scope', '$log', '$location', 'EmpresasResource', 'SeveridadesResource', 'IncClasesResource'];

  /**
   * Manejar de la sla de incidentes.
   *
   */
  function SlaController($scope, $log, $location, EmpresasResource, SeveridadesResource, IncClasesResource) {
    var vm = this;
    vm.empresas = [],
    vm.severidades = [];
    vm.incclases = [];
    /* ----------------------------------------------------
     * Entidad
     * ---------------------------------------------------- */
    vm.sla = {
      empresa: {},
      severidad: {},
      incclase: {},
      tiempo_resolucion: 0
    };
    /* ----------------------------------------------------
     * Observer
     * ---------------------------------------------------- */
    vm.slaObs = {
      uploader: {
        isSuccess: false,
        isError: false,
        isLoading: false,
        message: '',
      }
    };
    vm.newSla = newSla;

    /* ----------------------------------------------------
     * Resources
     * ---------------------------------------------------- */
    EmpresasResource.query({}, function (empresas) {
      vm.empresas = empresas;
      vm.sla.empresa = vm.empresas[1]; // Budbay
    });

    SeveridadesResource.query({}, function (severidades) {
      vm.severidades = severidades;
      vm.sla.severidad = vm.severidades[2]; // Severidad 3
    });

    IncClasesResource.query({}, function (clases) {
  		vm.incclases = clases;
  		vm.sla.incclase = vm.incclases[11]; // Otro
  	});


    /**
     * Registra un nuevo sla, en el servidor
     *
     * @param boolean isValid
     *
     * @return void
     */
    function newSla(isValid) {
      if(isValid) {
          vm.slaObs.uploader.isLoading = true;

          console.log(vm.sla);

          IncClasesResource.create(vm.sla, function (response) {
              vm.slaObs.uploader.isSuccess = true;
              vm.slaObs.uploader.message = response.message;
          }, function (error) {
              if(error.data.message) {
                  vm.slaObs.uploader.message = error.data.message;
              } else {
                  vm.slaObs.uploader.message = 'Error en el proceso de registro!';
              }

              vm.slaObs.uploader.isError = true;
          });
          console.log('isvalid');
      }
    }

  }

})();
