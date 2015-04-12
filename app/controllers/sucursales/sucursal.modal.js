(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ModalSucursalController', ModalSucursalController);

    ModalSucursalController.$inject = ['$modal', '$log'];

    /**
     *
     */
    function ModalSucursalController($modal, $log) {
        var vm = this;
        vm.open = open;

        function open(size) {
            var modalInstance = $modal.open({
                templateUrl: 'sucursalesModalContent.html',
                controller: 'ModalSucursalesInstanceController',
                size: size
            });

            modalInstance.result.then(function (selectedItems) {
                // ok btn
            }, function () {
                // cancel btn
                $log.info('Modal(sucursales) dismissed at: ' + new Date());
            });
        }

    }

})();
