/**
 * @package     controllers
 * @subpackage  modals
 *
 * @author    Edinson J. Sanchez
 * @copyright   Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ModalComponenteCtrl', 
    ['$scope', '$rootScope', '$modal', '$log',
    function ($scope, $rootScope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'componentesModalContent.html',
        controller: 'ModalComponentesInstanceCtrl',
        size: size
      });

      // acciones del modal a
      modalInstance.result.then(function (selectedItem) {
        // ok btn
        $rootScope.$broadcast('handlerSelectedComponente');
      }, function () {
        // cancel btn
        $log.info('Modal(componentes) dismissed at: ' + new Date());
      });
    };
}]);

app.controller('ModalComponentesInstanceCtrl',
  ['$scope', '$modalInstance', 'ComponenteFactory',
  function ($scope, $modalInstance, ComponenteFactory) {

  $scope.selected = {};

  $scope.$on('handlerSelectComponente', function() {
    $scope.selected.item = ComponenteFactory.componente;
  });

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);