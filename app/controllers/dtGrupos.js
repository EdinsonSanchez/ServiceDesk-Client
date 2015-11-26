// Dt con acciones personalizadas, permite seleccionar mas de un elemento de la lista.
app.controller('dtGruposWithActions',
    ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'IGrupoFactory',
    function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, IGrupoFactory) {

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/grupos')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    // selecciona un registro y lo envia al servicio
                    IGrupoFactory.pushItem(aData);
                });
            });
            return nRow;
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
        DTColumnBuilder.newColumn('nivel').withTitle('Nivel'),
    ];
}]);

app.controller('dtGrupos', ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'GrupoResource'
    , function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, GrupoResource){

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(grupos) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/grupos/' + id);
    };

    $scope.delete = function (id) {
        // Elimina la tipificacion seleccionada
        GrupoResource.delete({ id: id }, function (ok) {
            alert(ok.message);
            $scope.reloadData();
        }, function (error) {
            if(error.data.message) {
                alert(error.data.message);
            } else {
                alert('Error en el proceso para eliminar grupo!');
            }
        });
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/grupos')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        });

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('nombre').withTitle('Nombre'),
            //DTColumnBuilder.newColumn('nivel').withTitle('Nivel'),
            DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                        '   <i class="fa fa-eye"></i> Ver' +
                        '</button>&nbsp;' +
                        '<button class="btn btn-danger btn-sm" confirmed-click="delete(' + data.id + ')"' +
                        'ng-confirm-click="Estas seguro de eliminar el grupo ' + data.nombre  + '?" >' +
                        '   <span class="glyphicon glyphicon-trash"></span> Eliminar' +
                        '</button>&nbsp;';
                }),
        ];
}]);
