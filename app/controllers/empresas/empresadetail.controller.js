(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('EmpresaDetailController', EmpresaDetailController);

    EmpresaDetailController.$inject = ['$stateParams', '$location', 'EmpresaResource'];

    /**
     *
     */
    function EmpresaDetailController($stateParams, $location, EmpresaResource) {
        var vm = this;
        vm.empresa = {};
        // Control de envio y recepcion de respuesta del servidor.
        vm.empresaObs = {
            uploader: {
                isSuccess: false,
                isError: false,
                isLoading: false,
                message: '',
            }
        };
        vm.getCurrent = getCurrent;
        vm.updateEmpresa = updateEmpresa;

        getCurrent();

        function getCurrent() {
            EmpresaResource.show({ id: $stateParams.id }, function (currentEmpresa) {
                vm.empresa = currentEmpresa;
            }, function (error) {
                $location.url('/404');
            });
        }

        function updateEmpresa(isValid) {
            if(isValid) {
                // Bloque el boton hasta recibir respuesta del servidor.
                vm.empresaObs.uploader.isLoading = true;

                EmpresaResource.update(vm.empresa, function (response) {
                	vm.empresaObs.uploader.isSuccess = true;
                    vm.empresaObs.uploader.message = response.message;
                }, function (error) {
                	if(error.data.message) {
                        vm.empresaObs.uploader.message = error.data.message;
                    } else {
                        vm.empresaObs.uploader.message = 'Ocurrio un problema al actualizar la información!';
                    }

                    vm.empresaObs.uploader.isError = true;
                });
            }
        }
    }

})();
