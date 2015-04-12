(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('EmpresaController', EmpresaController);

    EmpresaController.$inject = ['$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'SucursalFactory', 'EmpresasResource'];

    function EmpresaController($scope, DTOptionsBuilder, DTColumnDefBuilder, SucursalFactory, EmpresasResource) {
        var vm = this;
        // Inicializa la interfaz de paso de datos entre controladores
        SucursalFactory.sucursales = [];

        /* ----------------------------------------------------
         * dtOptions - datatable
         * ---------------------------------------------------- */
        vm.dtOptions = DTOptionsBuilder.newOptions().withBootstrap().withPaginationType('full_numbers');
        /* ----------------------------------------------------
         * Entidad
         * ---------------------------------------------------- */
        vm.empresa = {
            sucursales: [],
            updatesites: false,
        };
        // Control de envio y recepcion de respuesta del servidor.
        vm.empresaObs = {
            uploader: {
                isSuccess: false,
                isError: false,
                isLoading: false,
                message: '',
            }
        };
        vm.removeItem = removeItem;
        vm.newEmpresa = newEmpresa;

        $scope.$on('handlerPushSucursal', function() {
            vm.empresa.sucursales = SucursalFactory.sucursales;
        });

        /* ----------------------------------------------------
         * Acciones principales
         * ---------------------------------------------------- */
        function removeItem (index) {
            vm.empresa.sucursales.splice(index, 1);
        }

        function newEmpresa(isValid) {
            if(isValid) {
                vm.empresaObs.uploader.isLoading = true;

                EmpresasResource.create(vm.empresa, function (response) {
                    vm.empresaObs.uploader.isSuccess = true;
                    vm.empresaObs.uploader.message = response.message;
                }, function (error) {
                    if(error.data.message) {
                        vm.empresaObs.uploader.message = error.data.message;
                    } else {
                        vm.empresaObs.uploader.message = 'Error en el proceso de registro!';
                    }

                    vm.empresaObs.uploader.isError = true;
                });
            }
        }
    }


})();
