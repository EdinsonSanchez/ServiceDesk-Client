/**
 * @package     ServiceDesk
 * @subpackage  controllers
 *
 * @author      Edinson J. Sanchez
 * @copyright   Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('dtComponentes',
    ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'ComponenteFactory',
    function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, ComponenteFactory) {
    
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(componentes) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/elementos/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/componentes')
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
                    ComponenteFactory.selectItem(aData);
                });
            });
            return nRow;
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Elemento'),
        DTColumnBuilder.newColumn('clasificacion.nombre').withTitle('Clasificación'),
        DTColumnBuilder.newColumn('estado.nombre').withTitle('Estado'),
        DTColumnBuilder.newColumn('criticidad.nombre').withTitle('Criticidad'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('sucursal.nombre').withTitle('Sucursal'),
        DTColumnBuilder.newColumn(null).withTitle('Referencia')
            .renderWith(function (data, type, full, meta) {
                if(data.parents != null) {
                    var itemsString = '';
                    angular.forEach(data.parents, function (item) {
                        itemsString += '<a href="#/elementos/' + item.id + '">' + item.nombre + '</a>, ';
                    }, this);

                    return itemsString;
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


// Dt con acciones personalizadas, permite seleccionar mas de un elemento de la lista.
app.controller('dtComponentesWithActions',
    ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'ComponenteFactory',
    function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, ComponenteFactory) {
    
    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/componentes')
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
                    ComponenteFactory.pushItem(aData);
                });
            });
            return nRow;
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Elemento'),
        DTColumnBuilder.newColumn('clasificacion.nombre').withTitle('Clasificación'),
        DTColumnBuilder.newColumn('estado.nombre').withTitle('Estado'),
        DTColumnBuilder.newColumn('criticidad.nombre').withTitle('Criticidad'),
        DTColumnBuilder.newColumn('empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('sucursal.nombre').withTitle('Sucursal'),
    ];
}]);
