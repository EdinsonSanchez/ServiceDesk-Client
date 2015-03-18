/**
 * @package		ServiceDesk
 * @subpackage	controllers
 *
 * @author		Edinson J. Sanchez
 * @copyright 	Copyright (C) 2015 Mine Sense Solutions SAC. All rights reserved.
 */

'use strict';

app.controller('UserTicketController',
	['$scope', '$log', '$timeout', 'AuthService', 'TicketsResource', function ($scope, $log, $timeout, AuthService, TicketsResource) {
	
	$scope.movimientos = {};
    $scope.user = AuthService.getUser();

    var retrieveItems = function () {
        
        if(AuthService.isAuthenticated()) {
            $scope.count = { severidad_1 : 0, severidad_2 : 0, severidad_3 : 0, severidad_4 : 0 };

            TicketsResource.query({ userId: $scope.user.id, option: 'asign' }, function (movimientos) {
                $scope.movimientos = movimientos;

                angular.forEach($scope.movimientos, function(movimiento) {

                    switch(movimiento.ticket.severidad_id) {
                        case 1: $scope.count.severidad_1++;
                        break;
                        case 2: $scope.count.severidad_2++;
                        break;
                        case 3: $scope.count.severidad_3++;
                        break;
                        case 4: $scope.count.severidad_4++;
                        break;
                    }
                }, this);

            }, function (error) {
                window.location = "/" + appName + '/offline.html';
                $log.info('Error produccido al obtener la informacion del servidor.');
            });
            
            $timeout(retrieveItems, 10000);
        }
        
    };

    retrieveItems();

}]);