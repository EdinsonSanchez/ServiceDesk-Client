// Dt con acciones personalizadas, permite seleccionar mas de un elemento de la lista.
app.controller('dtGruposWithActions',
    ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'IGrupoFactory',
    function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder, IGrupoFactory) {

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/grupos')
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

app.controller('dtGrupos', ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder'
    , function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder){
    
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(grupos) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/grupos/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/grupos')
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
                        '   <i class="fa fa-eye"></i>' +
                        '</button>&nbsp;';
                }),
        ];
}]);