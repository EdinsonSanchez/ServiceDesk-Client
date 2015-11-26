'use strict';
app.controller('dtRcareports',
    ['$scope', '$log', '$location', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder',
    function($scope, $log, $location, $compile, DTOptionsBuilder, DTColumnBuilder) {

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(reportes RCA) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/rcareport/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/rcareports')
        .withPaginationType('full_numbers')
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withBootstrap();

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('coordinador').withTitle('Coordinador')
            .renderWith(function (data, type, full, meta) {
                return data.nombre + ' ' + data.apellidos;
            }),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('sucursal.nombre').withTitle('Sucursal'),
        DTColumnBuilder.newColumn('impacto.nombre').withTitle('Impacto'),
        DTColumnBuilder.newColumn('urgencia.nombre').withTitle('Urgencia'),
        DTColumnBuilder.newColumn('prioridad').withTitle('Prioridad'),
        DTColumnBuilder.newColumn('incidencia').withTitle('Incidencia')
            .renderWith(function (data, type, full, meta) {
                return '<a target="_blank" href="#/tickets/' + data.id +'">' +data.prefijo + '-' + ("0000" + data.correlativo).slice(-5) + '</a>';
            }),
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;';
            }),
    ];
}]);
