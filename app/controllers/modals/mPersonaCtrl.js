/**
 * @package     controllers
 * @subpackage  modals
 *
 * @author    Edinson J. Sanchez
 * @copyright   Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ModalPersonaCtrl', 
    ['$scope', '$rootScope', '$modal', '$log',
    function ($scope, $rootScope, $modal, $log) {

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'personasModalContent.html',
        controller: 'ModalPersonasInstanceCtrl',
        size: size
      });

      // acciones del modal a
      modalInstance.result.then(function (selectedItem) {
        // ok btn
        $rootScope.$broadcast('handlerSelectedPersona');
      }, function () {
        // cancel btn
        $log.info('Modal(personas) dismissed at: ' + new Date());
      });
    };
}]);

app.controller('ModalPersonasInstanceCtrl',
  ['$scope', '$modalInstance', 'IPersonaFactory',
  function ($scope, $modalInstance, IPersonaFactory) {

  $scope.selected = {};

  $scope.$on('handlerSelectPersona', function() {
    $scope.selected.item = IPersonaFactory.persona;
  });

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);