(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ListClasesDt', ListClasesDt);

    ListClasesDt.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder'];

    /**
     * @namespace   controllers
     * @memberof    empresas
     *
     * @description Lista de las empresas, con acciones para mostrar y eliminar.
     */
    function ListClasesDt($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.reloadData = reloadData;
        vm.show = show;

        // Options Dt
        vm.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/incclases')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', function(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            });

        // Dt columns
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
            DTColumnBuilder.newColumn(null).withTitle('Nivel')
              .renderWith(function (data) {
                return "Nivel " + data.nivel;
              }),
            DTColumnBuilder.newColumn(null).withTitle('Prioridad')
              .renderWith(function (data) {
                return "Prioridad " + data.prioridad;
              }),
            DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="vm.show(' + data.id + ')">' +
                            '   <span class="fa fa-eye"></span> Ver' +
                            '</button>&nbsp;';
                }),
        ];

        function reloadData() {
            vm.dtOptions.reloadData();
            $log.info('Reload Data(Clases) at ' + new Date());
        }

        function show(id) {
            $location.path('/clases/' + id);
        }


    }

})();
