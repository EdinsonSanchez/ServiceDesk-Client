'use strict';
app.controller('dtTipificaciones',
    ['$scope', '$log', '$compile', '$location', 'TipificacionResource', 'AuthService', 'DTOptionsBuilder', 'DTColumnBuilder',
    function($scope, $log, $compile, $location, TipificacionResource, AuthService, DTOptionsBuilder, DTColumnBuilder) {

    // Usuario con la sesion actual.
    var currentUser = AuthService.getUser();

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(tipificaciones) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/tipificaciones/' + id);
    };

    $scope.delete = function (id) {
        // Elimina la tipificacion seleccionada
        TipificacionResource.delete({ id: id, deleted: currentUser.id }, function (ok) {
            alert(ok.message);
            $scope.reloadData();
        }, function (error) {
            if(error.data.message) {
                alert(error.data.message);
            } else {
                alert('Error en el proceso para eliminar tipificación!');
            }
        });
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/tipificaciones')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
        DTColumnBuilder.newColumn('categoria.nombre').withTitle('Categoria'),
        DTColumnBuilder.newColumn('impacto.nombre').withTitle('Impacto'),
        DTColumnBuilder.newColumn(null).withTitle('Referencia Superior')
             .renderWith(function (data, type, full, meta) {
                 if(data.parents != null) {
                     var itemsString = '';
                     angular.forEach(data.parents, function(item) {
                        itemsString += '<a href="#/tipificaciones/' + item.id + '">' + item.nombre + '</a>, ';
                     }, this);

                     return itemsString;
                 }
                 else return null;
             }),
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data, type, full, meta) {
                if(data.nivel == null) {
                    return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                        '   <span class="fa fa-eye"></span> Ver' +
                        '</button>&nbsp;' +
                        '<button class="btn btn-danger btn-sm" confirmed-click="delete(' + data.id + ')"' +
                        'ng-confirm-click="Estas seguro de eliminar la tipificación ' + data.nombre  + '?">' +
                        '   <span class="glyphicon glyphicon-trash"></span> Eliminar' +
                        '</button>&nbsp;';
                }
                else { return null };
            }),
    ];
}]);

// Dt con acciones personalizadas, permite seleccionar mas de un elemento de la lista.
app.controller('dtTipificacionesWithActions',
    ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'ITipificacionFactory',
    function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, ITipificacionFactory) {

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/tipificaciones')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    ITipificacionFactory.pushItem(aData);
                });
            });
            return nRow;
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
        DTColumnBuilder.newColumn('categoria.nombre').withTitle('Categoria'),
        DTColumnBuilder.newColumn('impacto.nombre').withTitle('Impacto'),
        DTColumnBuilder.newColumn(null).withTitle('Referencia Superior')
             .renderWith(function (data, type, full, meta) {
                 if(data.parents != null) {
                     var itemsString = '';
                     angular.forEach(data.parents, function(item) {
                        itemsString += item.nombre + ', ';
                     }, this);

                     return itemsString;
                 }
                 else return null;
             }),
    ];
}]);
