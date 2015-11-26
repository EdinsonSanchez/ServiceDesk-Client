(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ListSlasDt', ListSlasDt);

    ListSlasDt.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'IncClaseResource'];

    /**
     * @namespace   controllers
     * @memberof    empresas
     *
     * @description Lista de SLAs.
     */
    function ListSlasDt($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder, IncClaseResource) {
        var vm = this;
        vm.reloadData = reloadData;
        vm.show = show;
        vm.deleteSla = deleteSla;

        // Options Dt
        vm.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/slas')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', function(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            });

        // Dt columns
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('tiempo_resolucion').withTitle('Tiempo Max Resolución')
              .renderWith(function (data) {
                return data + " min";
              }),
            DTColumnBuilder.newColumn('empresa').withTitle('Empresa')
              .renderWith(function (data) {
                return data.razon_social;
              }),
            DTColumnBuilder.newColumn('severidad').withTitle('Severidad')
              .renderWith(function (data) {
                return data.nivel;
              }),
            DTColumnBuilder.newColumn('incclase').withTitle('Clase')
              .renderWith(function (data) {
                return data.nombre;
              }),
            DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="vm.show(' + data.id + ')">' +
                            '   <span class="fa fa-eye"></span> Ver' +
                            '</button>&nbsp;' +
                            '<button class="btn btn-danger btn-sm" confirmed-click="vm.deleteSla(' + data.id + ')"' +
                            'ng-confirm-click="Estas seguro de eliminar el SLA perteneciente a ' + data.empresa.razon_social + ' con ' + data.severidad.nivel + " asociado a " + data.incclase.nombre + '?">' +
                            '   <span class="glyphicon glyphicon-trash"></span> Eliminar' +
                            '</button>&nbsp;';
                }),
        ];

        function reloadData() {
            vm.dtOptions.reloadData();
            $log.info('Reload Data(Sla) at ' + new Date());
        }

        function show(id) {
            $location.path('/slas/' + id);
        }

        function deleteSla(id) {
          console.log('eliminando' + id);
          // Elimina la tipificacion seleccionada
          IncClaseResource.delete({ id: id }, function (ok) {
              alert(ok.message);
              vm.reloadData();
          }, function (error) {
              if(error.data.message) {
                  alert(error.data.message);
              } else {
                  alert('Error en el proceso para eliminar usuario!');
              }
          });
        }


    }

})();
