(function () {

        'use strict';

        angular
                .module('SDApp')
                .controller('ListUbicacionesDt', ListUbicacionesDt);

        ListUbicacionesDt.$inject = ['$scope', '$location', '$log', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'UbicacionesResource'];

        function ListUbicacionesDt($scope, $location, $log, $compile, DTOptionsBuilder, DTColumnBuilder, UbicacionesResource) {
                var vm = this;
                vm.reloadData = reloadData;
                vm.show = show;
                vm.deleteSla = deleteUbicacion;
		
                // Options Dt
                vm.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/ubicacions')
                        .withPaginationType('full_numbers')
                        .withBootstrap()
                        .withOption('createdRow', function (row, data, dataIndex) {
                                // Recompiling so we can bind Angular directive to the DT
                                $compile(angular.element(row).contents())($scope);
                        });
        
                // Dt columns
                vm.dtColumns = [
                        DTColumnBuilder.newColumn('id').withTitle('ID'),
                        DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
                        DTColumnBuilder.newColumn('descripcion').withTitle('Descripción'),
                        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                                .renderWith(function (data, type, full, meta) {
                                        return '<button class="btn btn-info btn-sm" ng-click="vm.show(' + data.id + ')">' +
                                                '   <span class="fa fa-eye"></span> Ver' +
                                                '</button>&nbsp;' +
                                                '<button class="btn btn-danger btn-sm" confirmed-click="vm.deleteUbicacion(' + data.id + ')"' +
                                                'ng-confirm-click="Estas seguro de eliminar la ubicación ' + data.nombre + '?">' +
                                                '   <span class="glyphicon glyphicon-trash"></span> Eliminar' +
                                                '</button>&nbsp;';
                                }),
                ];

                function reloadData() {
                        vm.dtOptions.reloadData();
                        $log.info('Reload Data(Sla) at ' + new Date());
                }

                function show(id) {
                        $location.path('/ubicaciones/' + id);
                }

                function deleteUbicacion(id) {
                
                        // Elimina la tipificacion seleccionada
                        UbicacionesResource.delete({ id: id }, function (ok) {
                                alert(ok.message);
                                vm.reloadData();
                        }, function (error) {
                                if (error.data.message) {
                                        alert(error.data.message);
                                } else {
                                        alert('Error en el proceso para eliminar usuario!');
                                }
                        });
                }
        }

})();