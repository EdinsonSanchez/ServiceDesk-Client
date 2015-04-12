(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('SucursalDetailController', SucursalDetailController);

    SucursalDetailController.$inject = ['$stateParams', '$location', 'SucursalResource', 'EmpresasResource'];

    function SucursalDetailController($stateParams, $location, SucursalResource, EmpresasResource) {
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
        vm.getCurrent = getCurrent;
        vm.getEmpresas = getEmpresas;
        vm.updateSucursal = updateSucursal;

        getEmpresas();
        getCurrent();

        function getEmpresas() {
            EmpresasResource.query({}, function (empresas) {
        		vm.empresas = empresas;
        	});
        }

        function getCurrent() {
            SucursalResource.show({ id: $stateParams.id }, function (currentSucursal) {
                vm.sucursal = currentSucursal;
            }, function (error) {
                $location.url('/404');
            });
        }

        function updateSucursal(isValid) {
            if(isValid) {
                // Bloque el boton hasta recibir respuesta del servidor.
                vm.sucursalObs.uploader.isLoading = true;

                SucursalResource.update(vm.sucursal, function (response) {
                    vm.sucursalObs.uploader.isSuccess = true;
                    vm.sucursalObs.uploader.message = response.message;
                }, function (error) {
                    if(error.data.message) {
                        vm.sucursalObs.uploader.message = error.data.message;
                    } else {
                        vm.sucursalObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                    }

                    vm.sucursalObs.uploader.isError = true;
                });
            }
        }
    }

})();
