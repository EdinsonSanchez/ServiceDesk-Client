(function () {
    'use strict';

    angular
        .module('SDApp')
        .controller('ModalSucursalesInstanceController', ModalSucursalesInstanceController);

    ModalSucursalesInstanceController.$inject = ['$modalInstance'];

    /**
     *
     */
    function ModalSucursalesInstanceController($modalInstance) {
        var vm = this;
        vm.ok = ok;
        vm.cancel = cancel;

        function ok() {
            // $modalInstance.close($scope.selected.item);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }

})();
