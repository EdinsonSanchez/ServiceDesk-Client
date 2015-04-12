(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ListEmpresasDt', ListEmpresasDt);

    ListEmpresasDt.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'EmpresaResource'];

    /**
     * @namespace   controllers
     * @memberof    empresas
     *
     * @description Lista de las empresas, con acciones para mostrar y eliminar.
     */
    function ListEmpresasDt($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder, EmpresaResource) {
        var vm = this;
        vm.reloadData = reloadData;
        vm.show = show;

        // Options Dt
        vm.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/empresas?option=list')
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withOption('createdRow', function(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            });

        // Dt columns
        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('razon_social').withTitle('Razon Social'),
            DTColumnBuilder.newColumn('cui').withTitle('CUI'),
            DTColumnBuilder.newColumn('rubro').withTitle('Rubro'),
            DTColumnBuilder.newColumn('web').withTitle('Web'),
            DTColumnBuilder.newColumn('email').withTitle('Email'),
            DTColumnBuilder.newColumn('telefono').withTitle('Telefono'),
            DTColumnBuilder.newColumn(null).withTitle('Sucursales')
                .renderWith(function (data) {
                    if(data.sucursales != null) {
                         var sucursalesString = '';
                         angular.forEach(data.sucursales, function(sucursal) {
                             sucursalesString += '[ <a href="#/sucursales/' + sucursal.id + '">' + sucursal.nombre + '</a> ], ';
                         }, this);

                         return sucursalesString;
                     }
                     else return null;
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
            $log.info('Reload Data(Empresas) at ' + new Date());
        }

        function show(id) {
            $location.path('/empresas/' + id);
        }


    }

})();
