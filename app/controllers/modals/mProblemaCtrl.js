/**
 * @package		controllers
 * @subpackage	modals
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ModalProblemaCtrl', 
	['$scope', '$rootScope', '$modal', '$log', 
	function ($scope, $rootScope, $modal, $log) {
	
		$scope.open = function (size) {
			var modalInstance = $modal.open({
				templateUrl: 'problemasModalContent.html',
				controller: 'ModalProblemasInstanceCtrl',
				size: size
			});

			// modal actions.
			modalInstance.result.then(function (selectedItem) {
				// ok btn.
				$rootScope.$broadcast('handlerSelectedTicket');
			}, function () {
				// cancel btn.
				$log.info('Modal(problema) dismissed at: ' + new Date());
			});
		};
}]);

app.controller('ModalProblemasInstanceCtrl',
	['$scope', '$modalInstance', 'TicketFactory',
	function($scope, $modalInstance, TicketFactory) {

		$scope.selected = {};

		$scope.$on('handlerSelectTicket', function () {
			$scope.selected.item = TicketFactory.ticket;
		});

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		}
}]);