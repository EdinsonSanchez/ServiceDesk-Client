app.controller('dtUsergroups', ['$scope', '$log', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder'
    , function($scope, $log, $compile, $location, DTOptionsBuilder, DTColumnBuilder){
    
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(usergroups) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/usergroups/' + id);
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/usergroups')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        });
    
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            // DTColumnBuilder.newColumn(null).withTitle('Parent'),
            DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                        '   <i class="fa fa-eye"></i>' +
                        '</button>&nbsp;';
                }),
        ];
}]);