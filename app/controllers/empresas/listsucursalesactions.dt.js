(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ListEmpresasDtWithActions', ListEmpresasDtWithActions);

    ListEmpresasDtWithActions.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'SucursalFactory'];


    /**
     * @namespace   controllers
     * @memberof    empresas
     *
     * @description Lista de las empresas, con acciones para enviar informacion
                    de un controlador a otro.
     */
    function ListEmpresasDtWithActions($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder, SucursalFactory) {
        var vm = this;
        vm.reloadData = reloadData;

        // Options Dt
        vm.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/sucursales?option=list')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', function(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            })
            .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function() {
                    $scope.$apply(function() {
                        // selecciona un registro y lo envia al servicio
                        SucursalFactory.pushItem(aData);
                    });
                });
                return nRow;
            });

            // Dt columns
            vm.dtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('ID'),
                DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
                DTColumnBuilder.newColumn('pais').withTitle('País'),
                DTColumnBuilder.newColumn('departamento').withTitle('Departamente'),
                DTColumnBuilder.newColumn('provincia').withTitle('Provincia'),
                DTColumnBuilder.newColumn('distrito').withTitle('Distrito'),
                DTColumnBuilder.newColumn('direccion').withTitle('Dirección'),
            ];

            function reloadData() {
                vm.dtOptions.reloadData();
                $log.info('Reload Data(Sucursales) at ' + new Date());
            }


    }

})();
