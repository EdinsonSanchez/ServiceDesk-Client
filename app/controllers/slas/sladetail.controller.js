(function () {
  'use strict';

  angular
    .module('SDApp')
    .controller('SlaDetailController', SlaDetailController);

  SlaDetailController.$inject = ['$scope', '$stateParams', '$log', '$location', 'EmpresasResource', 'SeveridadesResource', 'IncClasesResource', 'IncClaseResource'];

  /**
   * Manejar de la sla de incidentes.
   *
   */
  function SlaDetailController($scope, $stateParams, $log, $location, EmpresasResource, SeveridadesResource, IncClasesResource, IncClaseResource) {
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
    vm.updateSla = updateSla;

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

    getCurrent();

    function getCurrent() {
      IncClaseResource.show({ id: $stateParams.id }, function (currentSla) {
          vm.sla = currentSla;
      }, function (error) {
          $location.url('/404');
      });
    }

    /**
     * Actualizar un nuevo sla, en el servidor
     *
     * @param boolean isValid
     *
     * @return void
     */
     function updateSla(isValid) {
         if(isValid) {
             // Bloque el boton hasta recibir respuesta del servidor.
             vm.slaObs.uploader.isLoading = true;

             IncClaseResource.update(vm.sla, function (response) {
               vm.slaObs.uploader.isSuccess = true;
                 vm.slaObs.uploader.message = response.message;
             }, function (error) {
               if(error.data.message) {
                     vm.slaObs.uploader.message = error.data.message;
                 } else {
                     vm.slaObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                 }

                 vm.slaObs.uploader.isError = true;
             });
         }
     }

  }

})();
