(function () {
  'use strict';

  angular
    .module('SDApp')
    .controller('ClaseController', ClaseController);

  ClaseController.$inject = ['$scope', '$log', '$location', 'IncClasesResource'];

  /**
   * Manejar de la clase de incidentes.
   *
   */
  function ClaseController($scope, $log, $location, IncClasesResource) {
    var vm = this;

    vm.prioridades = [
  		{ id: 1, nombre: 'Prioridad 1' },
  		{ id: 2, nombre: 'Prioridad 2' },
  		{ id: 3, nombre: 'Prioridad 3' },
  		{ id: 4, nombre: 'Prioridad 4' },
  		{ id: 5, nombre: 'Prioridad 5' },
  		{ id: 6, nombre: 'Prioridad 6' },
  		{ id: 7, nombre: 'Prioridad 7' },
  	];
    vm.niveles = [
      {id: 1, nombre: 'Nivel 1'},
      {id: 2, nombre: 'Nivel 2'},
      {id: 3, nombre: 'Nivel 3'},
      {id: 4, nombre: 'Nivel 4'},
      {id: 5, nombre: 'Nivel 5'}
    ];
    vm.incclase = {
      nombre: '',
      nivel: vm.niveles[3],
      prioridad: vm.prioridades[4]
    };
    /* ----------------------------------------------------
     * Observer
     * ---------------------------------------------------- */
    vm.claseObs = {
      uploader: {
        isSuccess: false,
        isError: false,
        isLoading: false,
        message: '',
      }
    };
    vm.newIncClase = newIncClase;

    /**
     * Registra la clase de incidencia en el servidor.
     *
     * @param boolean isValid
     *
     * @return void
     */
    function newIncClase(isValid) {
      if(isValid) {
          vm.claseObs.uploader.isLoading = true;

          console.log(vm.sla);

          IncClasesResource.create(vm.incclase, function (response) {
              vm.claseObs.uploader.isSuccess = true;
              vm.claseObs.uploader.message = response.message;
          }, function (error) {
              if(error.data.message) {
                  vm.claseObs.uploader.message = error.data.message;
              } else {
                  vm.claseObs.uploader.message = 'Error en el proceso de registro!';
              }

              vm.claseObs.uploader.isError = true;
          });
          console.log('isvalid');
      }
    }
  }

})();
