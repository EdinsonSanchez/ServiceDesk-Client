'use strict';
app.controller('dtPersonas',
    ['$scope', '$log', '$timeout', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'IPersonaFactory',
    function($scope, $log, $timeout, $compile, $location, DTOptionsBuilder, DTColumnBuilder, IPersonaFactory) {
        
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(personas) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/personas/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/personas')
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
                    // $scope.someClickHandler(aData);
                    // selecciona un registro y lo envia al servicio
                    IPersonaFactory.selectItem(aData);
                });
            });
            return nRow;
        });
        
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Nombres'),
        DTColumnBuilder.newColumn('apellidos').withTitle('Apellidos'),
        DTColumnBuilder.newColumn('nro_documento').withTitle('Nro. Doc.'),
        DTColumnBuilder.newColumn('email').withTitle('Email'),
        DTColumnBuilder.newColumn('sucursal.empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('sucursal.nombre').withTitle('Sucursal'),
        DTColumnBuilder.newColumn('cargo.nombre').withTitle('Cargo'),
        DTColumnBuilder.newColumn('area.nombre').withTitle('Area'),
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
    ];
        
   // $timeout($scope.reloadData, 50);
}]);