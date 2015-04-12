(function () {

    'use strict';

    angular
        .module('SDApp')
        .controller('SucursalController', SucursalController);

    SucursalController.$inject = ['EmpresasResource', 'SucursalesResource'];

    /**
     *
     */
    function SucursalController(EmpresasResource, SucursalesResource) {
        var vm = this;
        vm.empresas = [];
        vm.sucursal = {
            empresa: {}
        };
        // Control de envio y recepcion de respuesta del servidor.
        vm.sucursalObs = {
            uploader: {
                isSuccess: false,
                isError: false,
                isLoading: false,
                message: '',
            }
        };
        vm.getEmpresas = getEmpresas;
        vm.newSucursal = newSucursal;

        getEmpresas();

        function getEmpresas() {
            EmpresasResource.query({}, function (empresas) {
        		vm.empresas = empresas;

        		vm.sucursal.empresa = vm.empresas[1]; // Budbay
        	});
        }

        function newSucursal(isValid) {
            if(isValid) {
                vm.sucursalObs.uploader.isLoading = true;

                SucursalesResource.create(vm.sucursal, function (response) {
                    vm.sucursalObs.uploader.isSuccess = true;
                    vm.sucursalObs.uploader.message = response.message;
                }, function (error) {
                    if(error.data.message) {
                        vm.sucursalObs.uploader.message = error.data.message;
                    } else {
                        vm.sucursalObs.uploader.message = 'Error en el proceso de registro!';
                    }

                    vm.sucursalObs.uploader.isError = true;
                });

            }
        }
    }


})();
