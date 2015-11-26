/**
 * @package     ServiceDesk
 * @subpackage  controllers
 *
 * @author      Edinson J. Sanchez
 * @copyright   Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('dtAreas', ['$scope', '$log', '$location', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder',
    function($scope, $log, $location, $compile, DTOptionsBuilder, DTColumnBuilder) {

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(areas) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/areas/' + id);
    };


    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/areas')
        .withPaginationType('full_numbers')
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withBootstrap();

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
        DTColumnBuilder.newColumn('centro_costo').withTitle('Centro de costo'),
        DTColumnBuilder.newColumn(null).withTitle('Área responsable')
            .renderWith(function (data, type, full, meta) {
                 if(data.parent != null) {
                     return '<a href="#/areas/' + data.parent.id +'">' + data.parent.nombre + '</a>';
                 }
                 else return null;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                        '   <i class="fa fa-eye"></i>' +
                        '</button>&nbsp;';
                }),
    ];
}]);
