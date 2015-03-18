/**
 * @package     controllers
 * @subpackage  modals
 *
 * @author    Edinson J. Sanchez
 * @copyright   Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ModalTipificacionCtrl', ['$scope', '$rootScope', '$modal', '$log', function ($scope, $rootScope, $modal, $log) {

    $scope.open = function (size) {
        var modalInstance = $modal.open({
              templateUrl: 'tipificacionesModalContent.html',
              controller: 'ModalTipificacionesInstanceCtrl',
              size: size
        });
        
        // Acciones principales del modal
        modalInstance.result.then (function (selectedItems) {
//            $rootScope.$broadcast('handlerSelectedTipificaciones');
        }, function () {
            // Cancel btn
            $log.info('Modal(tipificaciones) dismissed at: ' + new Date());
        });
    };
}]);

app.controller('ModalTipificacionesInstanceCtrl',
  ['$scope', '$modalInstance', 'ITipificacionFactory',
  function ($scope, $modalInstance, ITipificacionFactory) {

//  $scope.selected = {};
//
//  $scope.$on('handlerPushTipificacion', function() {
//    $scope.selected.items = ITipificacionFactory.tipificaciones;
//  });

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);