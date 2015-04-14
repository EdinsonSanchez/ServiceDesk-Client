'use strict';
app.controller('dtUsers',
    ['$scope', '$log', '$compile', '$location', 'UserResource', 'DTOptionsBuilder', 'DTColumnBuilder',
    function($scope, $log, $compile, $location, UserResource, DTOptionsBuilder, DTColumnBuilder) {

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(users) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/users/' + id);
    };

    $scope.delete = function (id) {
        // Elimina la tipificacion seleccionada
        UserResource.delete({ id: id }, function (ok) {
            alert(ok.message);
            $scope.reloadData();
        }, function (error) {
            if(error.data.message) {
                alert(error.data.message);
            } else {
                alert('Error en el proceso para eliminar usuario!');
            }
        });
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(apiUrl + '/users')
        .withPaginationType('full_numbers')
        .withBootstrap()
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('username').withTitle('Usuario'),
        DTColumnBuilder.newColumn('persona.nombre').withTitle('Nombres'),
        DTColumnBuilder.newColumn('persona.apellidos').withTitle('Apellidos'),
        DTColumnBuilder.newColumn('persona.email').withTitle('Email'),
        DTColumnBuilder.newColumn('persona.sucursal.empresa.razon_social').withTitle('Empresa'),
        DTColumnBuilder.newColumn('persona.sucursal.nombre').withTitle('Sucursal'),
        DTColumnBuilder.newColumn('persona.cargo.nombre').withTitle('Cargo'),
        DTColumnBuilder.newColumn(null).withTitle('Roles')
            .renderWith(function (data) {
                if(data.usergroups != null) {
                     var itemsString = '';
                     angular.forEach(data.usergroups, function(item) {
                        itemsString += '[ ' + item.title + ' ], ';
                     }, this);

                     return itemsString;
                 }
                 else return null;
            }),
        DTColumnBuilder.newColumn(null).withTitle('Acciones').notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<button class="btn btn-info btn-sm" ng-click="show(' + data.id + ')">' +
                        '   <span class="fa fa-eye"></span> Ver' +
                        '</button>&nbsp;' +
                        '<button class="btn btn-danger btn-sm" confirmed-click="delete(' + data.id + ')"' +
                        'ng-confirm-click="Estas seguro de eliminar el usuario ' + data.username  + '?">' +
                        '   <span class="glyphicon glyphicon-trash"></span> Eliminar' +
                        '</button>&nbsp;';
            }),
    ];
}]);
