/**
 * @package		controllers
 * @subpackage	modals
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2014 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('ModalTicketCtrl', 
	['$scope', '$rootScope', '$modal', '$log', 
	function ($scope, $rootScope, $modal, $log) {
	
		$scope.open = function (size) {
			var modalInstance = $modal.open({
				templateUrl: 'ticketsModalContent.html',
				controller: 'ModalTicketsInstanceCtrl',
				size: size
			});

			// modal actions.
			modalInstance.result.then(function (selectedItem) {
				// ok btn.
				$rootScope.$broadcast('handlerSelectedTicket');
			}, function () {
				// cancel btn.
				$log.info('Modal(tickets) dismissed at: ' + new Date());
			});
		};
}]);

app.controller('ModalTicketsInstanceCtrl',
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