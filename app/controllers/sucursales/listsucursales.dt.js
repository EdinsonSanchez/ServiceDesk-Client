(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ListSucursalesDt', ListSucursalesDt);

    ListSucursalesDt.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder'];

    /**
     *
     */
    function ListSucursalesDt($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.reloadData = reloadData;
        vm.show = show;

        // Options Dt
        vm.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/sucursales?option=list')
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
            DTColumnBuilder.newColumn('pais').withTitle('País'),
            DTColumnBuilder.newColumn('departamento').withTitle('Departamento'),
            DTColumnBuilder.newColumn('provincia').withTitle('Provincia'),
            DTColumnBuilder.newColumn('distrito').withTitle('Distrito'),
            DTColumnBuilder.newColumn('direccion').withTitle('Dirección'),
            DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
            DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="vm.show(' + data.id + ')">' +
                            '   <span class="fa fa-eye"></span> Ver' +
                            '</button>&nbsp;';
                }),
        ];

        function reloadData() {
            vm.dtOptions.reloadData();
            $log.info('Reload Data(Sucursales) at ' + new Date());
        }

        function show(id) {
            $location.path('/sucursales/' + id);
        }
    }

})();
