'use strict';
app.controller('dtPersonas',
    ['$scope', '$log', '$timeout', '$compile', '$location', 'DTOptionsBuilder', 'DTColumnBuilder', 'IPersonaFactory', 'PersonaResource',
    function($scope, $log, $timeout, $compile, $location, DTOptionsBuilder, DTColumnBuilder, IPersonaFactory, PersonaResource) {

    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
        $log.info('Reload Data(personas) at: ' + new Date());
    };

    $scope.show = function (id) {
        $location.path('/personas/' + id);
    };

    $scope.delete = function (id) {
        // Elimina la tipificacion seleccionada
        PersonaResource.delete({ id: id }, function (ok) {
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

    $scope.dtOptions = DTOptionsBuilder.fromSource(sandboxUnport + '/personas')
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
                    '</button>&nbsp;'+
                    '<button class="btn btn-danger btn-sm" confirmed-click="delete(' + data.id + ')"' +
                    'ng-confirm-click="Estas seguro de eliminar a ' + data.nombre + ' ' + data.apellidos  + '?">' +
                    '   <span class="glyphicon glyphicon-trash"></span>' +
                    '</button>&nbsp;';
            }),
    ];

   // $timeout($scope.reloadData, 50);
}]);
